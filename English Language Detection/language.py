# To detect if it's in the Dictionary of English Words
with open('words.txt', 'r') as f:
    words_set = set(f.read().lower().split())
sentence = 'The quick brown fox jumps over the lazy dog'
words = sentence.lower().split()
count = 0
for word in words:
    if word in words_set:
        count += 1
    else:
        print(word)

print(count/len(words)*100)
