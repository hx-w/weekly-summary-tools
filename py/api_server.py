# -*- coding: utf-8 -*-

import os
import sys
import json
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


@api.get('/info/prefix')
async def get_prefix():
    return gconfig.prefix


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


@api.get('/swsg/exec_merge')
async def swsg_exec_merge(group_name: str, week: str, filelist: str, force: bool = False):
    try:
        success, res = await scripts.swsg_exec_merge(group_name, week, json.loads(filelist), force)
        return {'success': success, 'res': res}
    except Exception as ept:
        raise HTTPException(403, f'{ept}')


@api.get('/swmg/group_list')
async def swmg_group_list(week: str):
    try:
        return await scripts.swmg_group_list(week)
    except Exception as ept:
        raise HTTPException(403, f'{ept}')


@api.get('/swmg/exec_merge')
async def swmg_exec_merge(week: str, filelist: str, force: bool = False):
    try:
        success, res = await scripts.swmg_exec_merge(week, json.loads(filelist), force)
        return {'success': success, 'res': res}
    except Exception as ept:
        raise HTTPException(403, f'{ept}')


@api.get('/mw/exec_merge')
async def mw_exec_merge(start_week_idx: int, end_week_idx: int, distname: str, force: bool = False):
    try:
        success, res = await scripts.mw_exec_merge(start_week_idx, end_week_idx, distname, force)
        return {'success': success, 'res': res}
    except Exception as ept:
        raise HTTPException(403, f'{ept}')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        exit()
        raise Exception('arg number wrong')
    if scripts.check_port_in_use(54321):
        raise Exception('port 54321 in use')
    gconfig.load_config(sys.argv[1])
    uvicorn.run(api, host='127.0.0.1', port=54321)
