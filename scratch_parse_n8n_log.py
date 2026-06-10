def run():
    try:
        with open('n8n_test_logging.log', 'r', encoding='utf-16') as f:
            lines = f.readlines()
        print(f"Total lines in log: {len(lines)}")
        print("\nDatabase queries from log:")
        for line in lines:
            line_str = line.strip()
            if 'activeVersion' in line_str:
                print("\n[Found activeVersion query in full]:")
                print(line_str)
            elif 'query:' in line_str or 'SELECT' in line_str or 'UPDATE' in line_str or 'INSERT' in line_str:
                # Truncate long lines to keep output clean
                if len(line_str) > 300:
                    print(line_str[:250] + " ... [TRUNCATED]")
                else:
                    print(line_str)
    except Exception as e:
        print("Failed to read log:", e)

if __name__ == '__main__':
    run()
