# -*- coding: utf-8 -*-
import re
import os
import logging
import yaml

logger = logging.getLogger()


class Config(object):
    def __init__(self) -> None:
        self.workspace = '06_工作周报'
        self.summary = '00_汇总'
        self.group = []
        self.prefix = '通用网格生成软件'
        self.group_pattern = '0.+_.+组'
        self.week_pattern = '\d{4}-\d{4}-\d{4}'
        self.template_group = ''
        self.template_project = ''
        logging.basicConfig(
            format='[%(levelname)s] %(message)s',
            level=logging.INFO
        )

    def __check(self) -> bool:
        logger.debug('正在检查工作目录')
        return os.path.exists(self.workspace)

    def __gen_group(self):
        pattern = re.compile(self.group_pattern)
        self.group = list(filter(
            lambda x: re.match(pattern, x),
            os.listdir(self.workspace)
        ))
        logger.debug(f'小组名称获取结束 {self.group}')

    def load_config(self, filename: str) -> None:
        try:
            with open(filename, 'r', encoding='utf-8') as ifile:
                config = yaml.safe_load(ifile)
                self.workspace = config['file_structure']['workspace']
                self.summary = config['file_structure']['summary']
                self.group = config['file_structure']['group']
                self.prefix = config['file_prefix']
                self.group_pattern = config['group_pattern']
                self.week_pattern = config['week_pattern']
                self.template_group = config['file_structure']['template']['group_summary']
                self.template_project = config['file_structure']['template']['project_summary']
                self.source_sheet = config['source_sheet']
            logger.info('配置文件读取成功')

            logger.setLevel(logging.DEBUG)

            if not self.__check():
                raise Exception('workspace不存在')
            
            if len(self.group) == 0:
                logger.debug('开始获取小组名称')
                self.__gen_group()

            self.group.sort()
        except Exception as ept:
            raise Exception(f'读取配置文件失败 <{ept}>')

gconfig = Config()