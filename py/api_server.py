# -*- coding: utf-8 -*-

import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from config import gconfig

api = FastAPI()

api.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_headers=['*'],
    allow_methods=['GET']
)


@api.get('/info/group_list')
async def group_list():
    return gconfig.group

@api.get('/info/week_list')
async def week_list():
    pass


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('error')
        raise Exception('arg number wrong')
    gconfig.load_config(sys.argv[1])
    uvicorn.run(api, host='127.0.0.1', port=4242)
