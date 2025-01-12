
from groq import Groq
def chat(prompt):
  client = Groq(api_key="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")
  completion = client.chat.completions.create(
      model="llama-3.3-70b-versatile",
      messages=[{
          "role":"user",
          "content":[
              {"type": "text", "text": prompt}
          ]
      }],
      temperature=1,
      max_tokens=1024,
  )
  return completion.choices[0].message.content  