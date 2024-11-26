import google.generativeai as genai
import os
from dotenv import load_dotenv
import speech_recognition as sr
import pyttsx3

load_dotenv()
API = os.getenv("API_KEY")
genai.configure(api_key=API)
model = genai.GenerativeModel("gemini-1.5-flash")

engine = pyttsx3.init()

recognizer = sr.Recognizer()

isExit = False

def speak(text):
    """Metni sesli okur."""
    engine.say(text)
    engine.runAndWait()

while not isExit:
    try:
        # mikrofon üzerinden ses tanıma
        with sr.Microphone() as source:
            print("Sizin için dinliyorum...")
            audio = recognizer.listen(source)
            text = recognizer.recognize_google(audio, language="tr-TR")
            print(f"Siz: {text}")

            if text.lower() == "çıkış":
                isExit = True
                print("Çıkış Yapıldı...")
                speak("Çıkış yapıldı.")
                break
            else:
                response = model.generate_content(text)
                print(f"Cevap: {response.text}")
                speak(response.text)

    except sr.UnknownValueError:
        print("Sesi anlayamadım, lütfen tekrar edin.")
        speak("Sesi anlayamadım, lütfen tekrar edin.")
    except sr.RequestError as e:
        print(f"Google ses tanıma hizmetinde bir hata oluştu: {e}")
        speak("Hizmette bir hata oluştu.")
    except Exception as e:
        print(f"Bir hata oluştu: {e}")
        speak("Bir hata oluştu.")
