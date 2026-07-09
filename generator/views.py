from django.http import JsonResponse
import secrets
import string

# A basic list of simple English words for memorable passphrases
WORD_LIST = [
    "apple", "banana", "cherry", "dragon", "eagle", "falcon", "guitar", "hammer", 
    "island", "jungle", "kangaroo", "lemon", "mango", "ninja", "ocean", "panda", 
    "quantum", "rocket", "shadow", "tiger", "umbrella", "vampire", "wizard", "xenon", 
    "yacht", "zebra", "brave", "clever", "silent", "happy", "rapid", "smooth", "wild",
    "blue", "green", "crimson", "silver", "gold", "velvet", "crystal", "stone", "water",
    "fire", "earth", "wind", "cloud", "storm", "winter", "summer", "autumn", "spring",
    "battery", "horse", "staple", "correct", "coffee", "mountain", "river", "valley"
]

def home(request):
    return JsonResponse({"message": "Password Generator API is running"})

def password(request):
    try:
        length = int(request.GET.get("length", 12))
    except (ValueError, TypeError):
        length = 12
        
    try:
        quantity = int(request.GET.get("quantity", 1))
    except (ValueError, TypeError):
        quantity = 1
        
    gen_type = request.GET.get("type", "random") # 'random', 'passphrase', or 'personalized'
    exclude_ambiguous = request.GET.get("exclude_ambiguous") == "true"
    personal_name = request.GET.get("personal_name", "").strip()
    personal_number = request.GET.get("personal_number", "").strip()
    
    passwords = []
    
    for _ in range(quantity):
        if gen_type == "passphrase" or gen_type == "personalized":
            if personal_name or personal_number:
                if request.GET.get("capitalize_first") == "true" and personal_name:
                    personal_name = personal_name[0].upper() + personal_name[1:]
                    
                symbols = list("!@#$%^&*()-_+={}[]|\\:;\"'")
                
                # Generate a string of 4 random symbols
                sym_str = ''.join(secrets.choice(symbols) for _ in range(4))
                
                # Combine name, symbols, and number (e.g. paul@&^*2004)
                pwd = f"{personal_name}{sym_str}{personal_number}"
                
                passwords.append(pwd)
            else:
                # For passphrases, we convert character length into word count (roughly 4 chars per word)
                word_count = max(length // 4, 3) 
                pwd = "-".join(secrets.choice(WORD_LIST) for _ in range(word_count))
                passwords.append(pwd)
        else:
            characters = list(string.ascii_lowercase)
            if request.GET.get("uppercase") == "true":
                characters.extend(list(string.ascii_uppercase))
            if request.GET.get("numbers") == "true":
                characters.extend(list(string.digits))
            if request.GET.get("special_characters") == "true":
                characters.extend(list("!@#$%^&*()-_+={}[]|\\:;\"'"))
                
            if exclude_ambiguous:
                ambiguous = set("l1IO0")
                characters = [c for c in characters if c not in ambiguous]
                
            if not characters:
                characters = list(string.ascii_lowercase) # Fallback if empty
                
            pwd = ''.join(secrets.choice(characters) for _ in range(length))
            passwords.append(pwd)
    
    return JsonResponse({"passwords": passwords})