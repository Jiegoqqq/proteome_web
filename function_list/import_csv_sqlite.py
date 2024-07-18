import sqlite3
import csv

# 连接到数据库
conn = sqlite3.connect('/home/jiego/colon/db.sqlite3')
cursor = conn.cursor()

# 創建表格（如果需要），使用csv文件的第一行作为列名
with open('/home/jiego/colon/CRC metabolites intensity area.csv', 'r', newline='', encoding='utf-8') as csvfile:
    csvreader = csv.reader(csvfile)
    header = next(csvreader)  # 获取CSV文件的第一行作为列名
    columns = ', '.join([f"'{col}' TEXT" for col in header])  # 以TEXT类型创建列
    cursor.execute(f'CREATE TABLE IF NOT EXISTS CRC_Data_2 ({columns})')

# 打開CSV文件並將數據插入表格
with open('/home/jiego/colon/CRC metabolites intensity area.csv', 'r', newline='', encoding='utf-8') as csvfile:
    csvreader = csv.reader(csvfile)
    next(csvreader)  # 跳過CSV文件的標題行
    for row in csvreader:
        placeholders = ', '.join(['?' for _ in row])
        cursor.execute(f'INSERT INTO CRC_Data_2 VALUES ({placeholders})', row)

# 提交更改並關閉連接
conn.commit()
conn.close()