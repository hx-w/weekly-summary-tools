# -*- coding: utf-8 -*-

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

api = FastAPI()

api.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_headers=['*'],
    allow_methods=['GET']
)


@api.get('/info/group_list')
async def group_list():
    return ['01_几何组', '02_结构网格组']


if __name__ == '__main__':
    uvicorn.run(api, host='127.0.0.1', port=4242)
