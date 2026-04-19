import os
import re

def strip_comments(content, ext):
    if ext in ['.java', '.js', '.jsx']:
        # Remove single-line comments // ...
        # We need to be careful not to match // inside strings like http://
        # A simple heuristic: replace // ... only if it's preceded by whitespace or start of line
        # This isn't perfect but works for most codebase comments.
        # Actually, using a proper regex for strings and comments:
        # Regex to match strings (single, double, backtick) OR comments
        
        # This regex matches:
        # 1. Strings: "..." or '...' or `...`
        # 2. Block comments: /* ... */
        # 3. Line comments: // ...
        # We replace matches: if it's a comment, return "", if string, return the string itself.
        
        pattern = r'(".*?(?<!\\)"|\'.*?(?<!\\)\'|`[\s\S]*?(?<!\\)`)|(/\*[\s\S]*?\*/|//.*)'
        
        def replacer(match):
            if match.group(2): # It's a comment
                return ""
            else: # It's a string
                return match.group(1)
                
        content = re.sub(pattern, replacer, content)
        
        if ext == '.jsx':
            # Remove JSX comments {/* ... */}
            content = re.sub(r'\{\/\*[\s\S]*?\*\/\}', '', content)
            
    return content

def main():
    dirs_to_process = [
        r"c:\SmartCharity\smartcharity\smartcharity-backend\src",
        r"c:\SmartCharity\smartcharity\smartcharity-frontend\src"
    ]
    
    for directory in dirs_to_process:
        for root, dirs, files in os.walk(directory):
            for file in files:
                ext = os.path.splitext(file)[1]
                if ext in ['.java', '.js', '.jsx']:
                    file_path = os.path.join(root, file)
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    new_content = strip_comments(content, ext)
                    
                    # Optional: clean up multiple empty lines
                    new_content = re.sub(r'\n\s*\n', '\n', new_content)
                    
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Stripped: {file_path}")

if __name__ == "__main__":
    main()
