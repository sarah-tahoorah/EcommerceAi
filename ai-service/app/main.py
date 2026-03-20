import base64
import json
from io import BytesIO
from pathlib import Path
from collections import Counter

import cv2
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from PIL import Image
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input

ROOT = Path(__file__).resolve().parents[2]
CATALOG_PATH = ROOT / "dataset" / "processed" / "catalog.json"
PRODUCTS_PUBLIC = ROOT / "server" / "public"

app = FastAPI(title="Sellora AI Service")
try:
  model = MobileNetV2(weights="imagenet", include_top=False, pooling="avg")
except Exception:
  model = MobileNetV2(weights=None, include_top=False, pooling="avg")


class ImageSearchRequest(BaseModel):
  image_base64: str
  file_name: str


class SizeAdvisorRequest(BaseModel):
  height_cm: float
  weight_kg: float
  gender: str
  body_type: str


class StyleQuizRequest(BaseModel):
  favorite_colors: list[str]
  preferred_style: str
  budget_range: str
  occasion: str
  clothing_type: str


def decode_image(raw_b64: str) -> np.ndarray:
  image_bytes = base64.b64decode(raw_b64)
  image = Image.open(BytesIO(image_bytes)).convert("RGB").resize((224, 224))
  arr = np.array(image, dtype=np.float32)
  arr = preprocess_input(arr)
  return np.expand_dims(arr, axis=0)


def image_feature(image_batch: np.ndarray) -> np.ndarray:
  feat = model.predict(image_batch, verbose=0)[0]
  norm = np.linalg.norm(feat) + 1e-10
  return feat / norm


def analyze_visual_cues(image_batch: np.ndarray):
  img = image_batch[0]
  img = ((img + 1.0) * 127.5).astype(np.uint8)
  bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
  h_img, w_img = bgr.shape[:2]
  y1, y2 = int(h_img * 0.15), int(h_img * 0.85)
  x1, x2 = int(w_img * 0.15), int(w_img * 0.85)
  roi = bgr[y1:y2, x1:x2]
  hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
  h = hsv[:, :, 0]
  s = hsv[:, :, 1]
  v = hsv[:, :, 2]

  white_ratio = float(np.mean((s < 35) & (v > 190)))
  black_ratio = float(np.mean(v < 55))
  gray_ratio = float(np.mean((s < 35) & (v >= 55) & (v <= 190)))
  sat_ratio = float(np.mean(s >= 35))
  v_mean = float(np.mean(v))

  neutral_ratio = white_ratio + black_ratio + gray_ratio
  if white_ratio > 0.25 or (white_ratio > 0.18 and neutral_ratio > 0.55):
    color = "White"
  elif black_ratio > 0.35:
    color = "Black"
  elif gray_ratio > 0.35:
    color = "Grey"
  elif sat_ratio < 0.08:
    if v_mean > 175:
      color = "White"
    elif v_mean < 75:
      color = "Black"
    else:
      color = "Grey"
  else:
    hue_masks = {
      "Red": (h < 10) | (h >= 170),
      "Orange": (h >= 10) & (h < 20),
      "Yellow": (h >= 20) & (h < 35),
      "Green": (h >= 35) & (h < 85),
      "Blue": (h >= 85) & (h < 130),
      "Purple": (h >= 130) & (h < 170)
    }
    sat_mask = s >= 35
    scores = {name: float(np.mean(mask & sat_mask)) for name, mask in hue_masks.items()}
    best_name, best_score = max(scores.items(), key=lambda x: x[1])
    if best_score < 0.02:
      if v_mean > 175:
        color = "White"
      elif v_mean < 75:
        color = "Black"
      else:
        color = "Grey"
    else:
      color = best_name

  gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
  blur = cv2.GaussianBlur(gray, (5, 5), 0)
  edges = cv2.Canny(blur, 80, 180)
  edge_density = float(np.mean(edges > 0))

  sat_color_mask = s >= 45
  sat_ratio_strong = float(np.mean(sat_color_mask))
  hue_std = float(np.std(h[sat_color_mask])) if np.any(sat_color_mask) else 0.0

  if edge_density > 0.14 and (sat_ratio_strong > 0.18 or hue_std > 22):
    pattern = "Printed"
  else:
    pattern = "Solid"

  return color, pattern


def category_from_name(file_name: str) -> str:
  lower = file_name.lower()
  mapping = {
    "kurti": "Kurti",
    "dress": "Dresses",
    "shirt": "Shirts",
    "tshirt": "T-Shirts",
    "saree": "Sarees",
    "jean": "Jeans",
    "shoe": "Shoes",
    "heel": "Heels",
    "handbag": "Handbags",
    "top": "Tops"
  }
  for k, v in mapping.items():
    if k in lower:
      return v
  return "Fashion"


def precompute_catalog():
  if not CATALOG_PATH.exists():
    return []
  payload = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
  products = payload.get("products", [])
  vectors = []
  for p in products:
    image_path = PRODUCTS_PUBLIC / p["imagePath"].lstrip("/")
    if not image_path.exists():
      continue
    try:
      image = Image.open(image_path).convert("RGB").resize((224, 224))
      arr = np.array(image, dtype=np.float32)
      arr = preprocess_input(arr)
      vec = image_feature(np.expand_dims(arr, axis=0))
      vectors.append((str(p.get("_id", "")), p["slug"], vec, p["category"], p.get("color", "")))
    except Exception:
      continue
  return vectors


CATALOG_VECTORS = precompute_catalog()


@app.get("/health")
def health():
  return {"ok": True, "vectors": len(CATALOG_VECTORS)}


def recommend_size(height_cm: float, weight_kg: float, gender: str, body_type: str):
  height_m = max(height_cm, 120.0) / 100.0
  bmi = weight_kg / max(height_m * height_m, 1e-6)
  gender = (gender or "").lower()
  body_type = (body_type or "").lower()

  if bmi < 18.5:
    base = "S"
  elif bmi < 24.5:
    base = "M"
  elif bmi < 29.5:
    base = "L"
  else:
    base = "XL"

  if body_type in ["athletic", "curvy", "pear", "hourglass"]:
    base = {"S": "M", "M": "L", "L": "XL", "XL": "XL"}[base]
  if body_type in ["petite"]:
    base = {"S": "S", "M": "S", "L": "M", "XL": "L"}[base]

  confidence = 0.88
  if bmi < 16 or bmi > 34:
    confidence = 0.72
  if gender in ["female", "f"] and base == "XL":
    confidence -= 0.04
  if gender in ["male", "m"] and base == "S":
    confidence -= 0.04

  return base, max(min(confidence, 0.95), 0.65)


def style_profile(preferred_style: str, occasion: str):
  style = (preferred_style or "").lower()
  occ = (occasion or "").lower()

  if style == "traditional" and occ in ["wedding", "party"]:
    return "Royal Traditional"
  if style == "formal" and occ in ["office"]:
    return "Power Formal"
  if style == "streetwear":
    return "Urban Street"
  if style == "casual" and occ in ["daily wear", "office"]:
    return "Elegant Casual"
  return "Modern Minimal"


@app.post("/image-search")
def image_search(payload: ImageSearchRequest):
  img = decode_image(payload.image_base64)
  query_vec = image_feature(img)
  color, pattern = analyze_visual_cues(img)
  name_hint = category_from_name(payload.file_name)

  scored = []
  for product_id, slug, vec, category, product_color in CATALOG_VECTORS:
    score = float(np.dot(query_vec, vec))
    if name_hint != "Fashion" and category == name_hint:
      score += 0.08
    if product_color.lower() == color.lower():
      score += 0.03
    scored.append((score, product_id, slug, category))

  top = sorted(scored, key=lambda x: x[0], reverse=True)[:12]
  top_categories = [row[3] for row in top[:5]]
  detected_type = Counter(top_categories).most_common(1)[0][0] if top_categories else name_hint
  return {
    "analysis": {"type": detected_type, "color": color, "pattern": pattern},
    "matches": [{"product_id": pid, "slug": slug, "score": round(score, 4)} for score, pid, slug, _ in top]
  }


@app.post("/size-advisor")
def size_advisor(payload: SizeAdvisorRequest):
  size, confidence = recommend_size(payload.height_cm, payload.weight_kg, payload.gender, payload.body_type)
  return {
    "recommended_size": size,
    "confidence": round(confidence * 100),
    "message": f"Based on your body measurements, {size} will provide the best fit."
  }


@app.post("/style-quiz")
def style_quiz(payload: StyleQuizRequest):
  profile = style_profile(payload.preferred_style, payload.occasion)
  return {
    "style_profile": profile,
    "recommended_colors": payload.favorite_colors,
    "preferred_style": payload.preferred_style,
    "budget_range": payload.budget_range,
    "occasion": payload.occasion,
    "clothing_type": payload.clothing_type
  }
