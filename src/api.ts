// src/api.ts
import axios from 'axios';
import { GEMINI_API_KEY, BACKEND_API_URL, GOOGLE_MAPS_API_KEY } from './constants';

export const getAiAnalysis = async (foodName: string, baseFood: { name: string, kcal: number }) => {
  const MODEL_NAME = 'gemini-flash-latest'; 
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;
  
  const systemPrompt = `
    당신은 영양 전문가입니다. 사용자가 입력한 '${foodName}'의 대략적인 칼로리를 분석하고, 
    사용자가 선호하는 '${baseFood.name}'(${baseFood.kcal}kcal)의 몇 배인지 계산해서 JSON으로만 답하세요.
    응답 형식: { "kcal": 500, "ratio": 1.5, "message": "너무 높아요! 조심하세요." }
  `;

  try {
    const response = await axios.post(
      `${API_URL}?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: systemPrompt }] }] },
      { headers: { 'Content-Type': 'application/json' } }
    );
    const responseText = response.data.candidates[0].content.parts[0].text;
    const cleanedJson = responseText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedJson);
  } catch (error: any) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    return null;
  }
};

export const saveCoffeeApi = async (coffeeName: string, caffeine: number, brand: string) => {
  return axios.post(`${BACKEND_API_URL}/coffee/save`, { coffeeName, caffeine, brand });
};

export const fetchCoffeeApi = async () => {
  const response = await axios.get(`${BACKEND_API_URL}/api/coffee/list`);
  return response.data;
};

export const fetchPlaceDetails = async (placeId: string) => {
  if (!GOOGLE_MAPS_API_KEY) return null;
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_phone_number,website,price_level,photos,rating,user_ratings_total&language=ko&key=${GOOGLE_MAPS_API_KEY}`;
    const res = await axios.get(url);
    return res.data.result;
  } catch (error: any) {
    console.error("Place Details API error:", error.response?.data || error.message);
    return null;
  }
};