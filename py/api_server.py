# -*- coding: utf-8 -*-

import os
import sys
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from config import gconfig
import scripts

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
async def week_list(reverse: bool = True, single_week: bool = True):
    try:
        return await scripts.info_week_list(reverse, single_week)
    except Exception as ept:
        raise HTTPException(403, f'{ept}')


@api.get('/swsg/name_list')
async def swsg_name_list(group_name: str, week: str):
    source_dir = os.path.join(
        gconfig.workspace,
        os.path.join(group_name, week)
    )
    if not os.path.exists(source_dir):
        raise HTTPException(403, '路径不存在')
    try:
        return await scripts.swsg_name_list(source_dir, week)
    except Exception as ept:
        raise HTTPException(403, f'{ept}')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        raise Exception('arg number wrong')
    gconfig.load_config(sys.argv[1])
    uvicorn.run(api, host='127.0.0.1', port=4242)
