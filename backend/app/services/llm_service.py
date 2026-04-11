from google import genai
import os
import json

# ✅ NEW SDK: no configure()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def generate_llm_explanation(data):
    try:
        # Convert dict → formatted JSON string
        json_data = json.dumps(data, indent=2)

        prompt = f"""
You are a retail demand forecasting analyst.

Explain the forecast in simple business language for a store manager.

DATA:
{json_data}

INSTRUCTIONS:
- Be concise (5–6 lines)
- Explain WHY demand is high or low
- Mention top drivers clearly
- If simulation data is present, compare it with baseline
- Suggest 1–2 actionable insights (inventory, pricing, promotion)
- Avoid technical jargon like SHAP, features, or model terms
"""

        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt,
            generation_config={
                "temperature": 0.3
            }
        )

        return response.text

    except Exception as e:
        print(f"LLM Error: {e}")
        return "Explanation temporarily unavailable. Please refer to the structured data."