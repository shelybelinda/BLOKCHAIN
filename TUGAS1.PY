from base64 import encode
import sha3

identitas = input("Masukan identitas: ")
print("Identitas sebelum di hash: \n", identitas)
encoded = identitas.encode()
obj_encoded = sha3.keccak_256(encoded)
print("Identitas setelah di hash: \n", obj_encoded.hexdigest())
