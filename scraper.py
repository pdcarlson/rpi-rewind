import json
import re
import requests
from bs4 import BeautifulSoup
import time

# --- configuration ---

# file containing the full collection data (e.g., photograph-collection-data.jsonld)
COLLECTION_MANIFEST_FILE = 'photograph-collection-data.jsonld'

# the new, clean json file we will create
OUTPUT_FILE = 'events.json'

# regex to find a 4-digit year (e.g., 1985, 1890)
# this is our primary filter.
YEAR_REGEX = re.compile(r'\b(18[0-9]{2}|19[0-9]{2}|20[0-9]{2})\b')

# --- main script ---

def get_specific_item_data(manifest_url):
    """
    fetches the specific item manifest from its url and extracts
    the detailed description and full-size image url.
    """
    
    # we'll mimic a common web browser to avoid being blocked
    headers = {
        'user-agent': 'mozilla/5.0 (windows nt 10.0; win64; x64) applewebkit/537.36 (khtml, like gecko) chrome/58.0.3029.110 safari/537.36'
    }

    try:
        # fetch the individual manifest
        response = requests.get(manifest_url, timeout=10, headers=headers)
        response.raise_for_status()  # raises an error for bad responses (4xx, 5xx)
        data = response.json()

        description = ""
        image_url = ""

        # 1. extract rich description
        # descriptions are in the 'metadata' array
        if 'metadata' in data:
            for item in data['metadata']:
                if item.get('label', {}).get('en', []) == ['description']:
                    # description is html, so we use beautifulsoup to get clean text
                    html_desc = item.get('value', {}).get('en', [""])[0]
                    soup = BeautifulSoup(html_desc, 'html.parser')
                    description = soup.get_text(strip=True)
                    break  # found it, no need to keep looping

        # 2. extract full-size image url
        # the full-size image is in the 'items' array
        if 'items' in data and len(data['items']) > 0:
            # navigate down the complex json-ld structure
            annotation_page = data['items'][0].get('items', [])
            if len(annotation_page) > 0:
                annotation = annotation_page[0].get('items', [])
                if len(annotation) > 0:
                    image_url = annotation[0].get('body', {}).get('id', '')

        return description, image_url

    except requests.exceptions.RequestException as e:
        print(f"  [error] could not fetch {manifest_url}: {e}")
        return None, None
    except json.JSONDecodeError:
        print(f"  [error] could not parse json from {manifest_url}")
        return None, None
    
def generate_era(year):
    """
    generates an 'era' string (e.g., "1980s") from a given year.
    """
    if not isinstance(year, int):
        return "unknown"
    # this creates the decade string by taking the first 3 digits and adding a '0s'
    # e.g., 1985 -> "198" -> "1980s"
    return f"{year // 10 * 10}s"

def process_collection_manifest():
    """
    main function to process the entire collection.
    """
    print(f"--- starting data pipeline ---")
    print(f"loading collection manifest: {COLLECTION_MANIFEST_FILE}")

    try:
        with open(COLLECTION_MANIFEST_FILE, 'r', encoding='utf-8') as f:
            collection_data = json.load(f)
    except FileNotFoundError:
        print(f"[fatal error] file not found: {COLLECTION_MANIFEST_FILE}")
        print("please make sure the file is in the same directory as the script.")
        return
    except json.JSONDecodeError:
        print(f"[fatal error] could not parse json in {COLLECTION_MANIFEST_FILE}.")
        return

    if 'items' not in collection_data:
        print(f"[fatal error] manifest has no 'items' array. invalid format.")
        return

    all_items = collection_data['items']
    print(f"found {len(all_items)} total items in the collection.")

    final_events = []
    
    # --- stage 1: find items with a year ---
    
    # holds the items we actually want to fetch
    items_to_fetch = []

    for item in all_items:
        title = item.get('label', {}).get('en', [""])[0]
        if not title:
            continue # skip if no title
        
        # use our regex to find a year
        match = YEAR_REGEX.search(title)
        
        if match:
            # a year was found!
            year_int = int(match.group(1))
            manifest_url = item.get('id', '')
            
            if manifest_url:
                items_to_fetch.append({
                    'title': title,
                    'year': year_int,
                    'manifest_url': manifest_url
                })

    print(f"--- stage 1 complete ---")
    print(f"filtered down to {len(items_to_fetch)} items with a year in their title.")
    print(f"--- starting stage 2: fetching specific item data ---")

    # --- stage 2: fetch rich data for each item ---
    
    for i, item in enumerate(items_to_fetch):
        print(f"fetching item {i+1} of {len(items_to_fetch)}: {item['title'][:40]}...")
        
        # call our function to get the rich data
        description, image_url = get_specific_item_data(item['manifest_url'])
        
        if description and image_url:
            # success! build our final, clean object
            new_event = {
                'title': item['title'],
                'description': description,
                'year': item['year'],
                'era': generate_era(item['year']),
                'image_url': image_url
            }
            final_events.append(new_event)
            
            # being a good citizen to the archive's server
            time.sleep(0.1) # small delay between requests
            
    print(f"--- stage 2 complete ---")
    print(f"successfully processed {len(final_events)} items.")

    # --- stage 3: write final json file ---
    
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(final_events, f, indent=2, ensure_ascii=False)
        
        print(f"\n[success] all done!")
        print(f"clean data has been written to: {OUTPUT_FILE}")

    except IOError as e:
        print(f"\n[fatal error] could not write output file: {e}")

# --- run the script ---
if __name__ == "__main__":
    process_collection_manifest()