from flask import current_app as app
from flask_caching import Cache

cache = Cache(config={'CACHE_TYPE': 'RedisCache'})
