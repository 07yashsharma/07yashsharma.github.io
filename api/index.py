"""
Vercel Serverless Function entry point for Flask backend.
"""
import os
import sys

# Ensure parent directory is in path for module imports
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from server import app

# Vercel looks for the WSGI variable 'app'
