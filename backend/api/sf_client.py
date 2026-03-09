import os
from simple_salesforce import Salesforce
from dotenv import load_dotenv

load_dotenv()

def get_sf_connection():
    """
    Returns an authenticated simple-salesforce connection object.
    Requires SF_USERNAME, SF_PASSWORD, SF_SECURITY_TOKEN, 
    SF_CONSUMER_KEY, and SF_CONSUMER_SECRET to be set in .env.
    """
    try:
        sf = Salesforce(
            username=os.getenv('SF_USERNAME'),
            password=os.getenv('SF_PASSWORD'),
            security_token=os.getenv('SF_SECURITY_TOKEN'),
            consumer_key=os.getenv('SF_CONSUMER_KEY'),
            consumer_secret=os.getenv('SF_CONSUMER_SECRET'),
            domain=os.getenv('SF_DOMAIN', 'login')
        )
        return sf
    except Exception as e:
        print(f"Error connecting to Salesforce: {e}")
        return None
