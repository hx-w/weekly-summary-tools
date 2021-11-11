# -*- coding: utf-8 -*-

import re
import os
import shutil
import openpyxl
import datetime
from config import gconfig

align = openpyxl.styles.Alignment(
    horizontal='left', vertical='center', wrap_text=False)

async def info_week_list(reverse: bool, single_week: bool) -> list:
    weeklist = list(filter(
        lambda x: re.match(gconfig.week_pattern, x),
        os.listdir(gconfig.summary)
    ))
    weeklist.sort(reverse=reverse)
    if single_week:
        return weeklist
    weeklist = list(filter(
        lambda x: os.path.exists(
            os.path.join(os.path.join(gconfig.summary, x),
                         f'{gconfig.prefix}项目工作周报-{x}.xlsx')
        ),
        weeklist
    ))
    return weeklist


async def swsg_name_list(source_dir: str, week: str) -> list:
    file_pattern = re.compile(f'{gconfig.prefix}个人工作周报-{week}-(.*?).xlsx')
    file_list = list(filter(
        lambda x: re.match(file_pattern, x),
        os.listdir(source_dir)
    ))
    file_list = list(map(
        lambda x: {
            'title': re.findall(file_pattern, x)[0],
            'key': x
        },
        file_list
    ))
    return file_list


async def swsg_exec_merge(group_name: str, week: str, filelist: list, force: bool = False) -> tuple:
    source_dir = os.path.join(
        gconfig.workspace, os.path.join(group_name, week)
    )
    pattern = re.compile(f'{gconfig.prefix}个人工作周报-{week}-(.*).xlsx')
    # filelist = list(filter(
    #     lambda x: re.match(pattern, x),
    #     os.listdir(source_dir)
    # ))
    dist_dir = os.path.join(gconfig.summary, week)
    if not os.path.exists(dist_dir):
        os.makedirs(dist_dir)
    dist_path = os.path.join(
        dist_dir,
        f'{gconfig.prefix}小组工作周报-{week}-{group_name[3:]}.xlsx'
    )
    # backup
    if os.path.exists(dist_path) and not force:
        return False, dist_path
    # cp template
    shutil.copyfile(gconfig.template_group, dist_path)

    dist_book = openpyxl.load_workbook(dist_path)
    dist_sheet = dist_book['工作任务项']
    dist_sheet.delete_rows(2, dist_sheet.max_row + 1)
    col_name, col_date = 0, 0
    for idx in range(1, 1 + dist_sheet.max_column):
        if dist_sheet.cell(1, idx).value == '姓名':
            col_name = idx - 1
        elif dist_sheet.cell(1, idx).value == '日期（年/月/日）':
            col_date = idx - 1
    total_order = 1

    for eachfile in filelist:
        name = re.findall(pattern, eachfile)[0]
        full_path = os.path.join(source_dir, eachfile)
        source_sheet = openpyxl.load_workbook(
            full_path, read_only=True)['工作任务项']
        # print(source_sheet[1])
        for row_idx in range(2, source_sheet.max_row + 1):
            row_element = []
            for col_idx in range(1, source_sheet.max_column + 1):
                row_element.append(source_sheet.cell(
                    row=row_idx, column=col_idx).value)
            if None in row_element:
                break
            row_element.insert(col_name, name)
            if row_element[col_date] and not isinstance(row_element[col_date], str):
                row_element[col_date] = datetime.datetime.strftime(
                    row_element[col_date], "%Y/%m/%d")
            row_element[0] = total_order
            dist_sheet.append(row_element)
            total_order += 1

    # align to left
    for row in dist_sheet.iter_rows(min_row=2):
        for col in row:
            col.alignment = align

    # update pivot table
    for sheet_idx in range(len(dist_book.sheetnames)):
        if dist_book.sheetnames[sheet_idx] == '工作任务项':
            continue
        try:
            pivot_sheet = dist_book[dist_book.sheetnames[sheet_idx]]
            pivot = pivot_sheet._pivots[0]  # 任何一个都可以共享同一个缓存
            boundary = f'A1:{chr(ord("A") + dist_sheet.max_column - 1)}{dist_sheet.max_row}'
            pivot.cache.cacheSource.worksheetSource.ref = boundary
            pivot.cache.refreshOnLoad = True  # 刷新加载
        except:
            pass

    dist_book.save(dist_path)

    return True, dist_path


import socket

def check_port_in_use(port, host='127.0.0.1'):
    s = None
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1)
        s.connect((host, int(port)))
        return True
    except socket.error:
        return False
    finally:
        if s:
            s.close()