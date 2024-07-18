import os
import json
import sys
import numbers
import pandas as pd
import numpy as np
import pymysql
from django.shortcuts import render
from datetime import datetime
from django.http import HttpResponse, JsonResponse
from django.db import connection
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render


def proteomes_screener(request):
    return render(request,'proteomes_screener.html', locals())
    
def build_condition(input_value, condition_value, column_name):
    """根據输入值和條件值建立 SQL 條件"""
    if input_value != 9999:
        if condition_value == "greater":
            return f"{column_name} > {input_value}"
        elif condition_value == "less":
            return f"{column_name} < {input_value}"
    return ""
@csrf_exempt
def proteomes_screener_table(request):

    input_allele_Value = request.POST.get('input_allele_Value')
    input_ID_Value = request.POST.get('input_ID_Value')
    nM_condition_Value = request.POST.get('nM_condition_Value')
    nM_input_Value = request.POST.get('nM_input_Value')
    Rank_BA_condition_Value = request.POST.get('Rank_BA_condition_Value')
    Rank_BA_input_Value = request.POST.get('Rank_BA_input_Value')
    allele_list = input_allele_Value.split(", ")
    ID_list = input_ID_Value.split(", ")

    if allele_list[0] != '':

        all_table_data_list = []
        # chech if ID list
        if ID_list[0] != '':
            id_list_str = ', '.join(f"'{id_value}'" for id_value in ID_list)

        for allele in allele_list:
            table_name = f'web_virus_78_{allele}_minimum_Rank_BA'
            print(table_name)

            # nM 和 Rank BA filter
            nM_condition = build_condition(nM_input_Value, nM_condition_Value, "nM")
            Rank_BA_condition = build_condition(Rank_BA_input_Value, Rank_BA_condition_Value, "Rank_BA")

            conditions = [condition for condition in [nM_condition, Rank_BA_condition] if condition]
            conditions_str = " AND ".join(conditions)

            # sql query
            if ID_list[0] != '':
                sql_query = f"SELECT * FROM {table_name} WHERE ID IN ({id_list_str})"
                if conditions_str:
                    sql_query += f" AND {conditions_str}"
            else:
                sql_query = f"SELECT * FROM {table_name}"
                if conditions_str:
                    sql_query += f" WHERE {conditions_str}"

            # sql_query = f"SELECT * FROM {table_name} WHERE ID IN ({id_list_str}) {nM_condition} {Rank_BA_condition}" if ID_list[0] != '' else f"SELECT * FROM {table_name} {nM_condition} {Rank_BA_condition}"
            # 搜尋資料庫
            with connection.cursor() as cursor:
                cursor.execute(sql_query)
                table_data = pd.DataFrame(cursor.fetchall(), columns=[i[0] for i in cursor.description])
                all_table_data_list.append(table_data)

        all_table_data = pd.concat(all_table_data_list, ignore_index=True)


    else:
        
        allele_list = ['DRB1_0101', 'DRB1_0301', 'DRB1_0401', 'DRB1_0405', 'DRB1_0701', 'DRB1_0802', 'DRB1_0901', 'DRB1_1101', 'DRB1_1201', 'DRB1_1302', 'DRB1_1501', 'DRB3_0101', 'DRB3_0202', 'DRB4_0101', 'DRB5_0101', 'HLA_DQA10501_DQB10201', 'HLA_DQA10501_DQB10301', 'HLA_DQA10301_DQB10302', 'HLA_DQA10401_DQB10402', 'HLA_DQA10101_DQB10501', 'HLA_DQA10102_DQB10602', 'HLA_DPA10201_DPB10101', 'HLA_DPA10103_DPB10201', 'HLA_DPA10103_DPB10401', 'HLA_DPA10301_DPB10402', 'HLA_DPA10201_DPB10501', 'HLA_DPA10201_DPB11401']
        all_table_data_list = []
        # chech if ID list
        if ID_list[0] != '':
            id_list_str = ', '.join(f"'{id_value}'" for id_value in ID_list)

        for allele in allele_list:
            table_name = f'web_virus_78_{allele}_minimum_Rank_BA'
            print(table_name)

            # nM 和 Rank BA filter
            nM_condition = build_condition(nM_input_Value, nM_condition_Value, "nM")
            Rank_BA_condition = build_condition(Rank_BA_input_Value, Rank_BA_condition_Value, "Rank_BA")

            conditions = [condition for condition in [nM_condition, Rank_BA_condition] if condition]
            conditions_str = " AND ".join(conditions)

            # sql query
            if ID_list[0] != '':
                sql_query = f"SELECT * FROM {table_name} WHERE ID IN ({id_list_str})"
                if conditions_str:
                    sql_query += f" AND {conditions_str}"
                
            else:
                sql_query = f"SELECT * FROM {table_name}"
                if conditions_str:
                    sql_query += f" WHERE {conditions_str}"
 
            # 搜尋資料庫
            with connection.cursor() as cursor:
                cursor.execute(sql_query)
                table_data = pd.DataFrame(cursor.fetchall(), columns=[i[0] for i in cursor.description])
                all_table_data_list.append(table_data)
                
        all_table_data = pd.concat(all_table_data_list, ignore_index=True)


    all_table_data_dict = all_table_data.to_dict(orient='records')
    # print(all_table_data_dict)
    response = {
        'all_table_data_dict': all_table_data_dict,
        }
    return JsonResponse(response)