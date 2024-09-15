from pickle import TRUE
from docxtpl import DocxTemplate, InlineImage,RichText
from docx.shared import Mm
import sys
import json
import os

json_data = sys.argv[1] # json file
template_docx_file = sys.argv[2] # template docx file
output_docx_file = sys.argv[3] # output file

tpl = DocxTemplate(template_docx_file)

with open(json_data,newline='', encoding='utf-8') as f:context = json.load(f)
#context = json.loads(json_data)
try:  
    #-------
    logo1=context["data"]["logo1"]
    image1 = context["data"]["image1"]
    rtext=context["data"]["rtext"]
    text_bold=context["data"]["text_bold"]
    docx_file_path=os.path.abspath(os.getcwd())+output_docx_file
     
    context["data"]["logo1"] = InlineImage(tpl, logo1, height=Mm(30),width=Mm(30))
    context["data"]["image1"] = InlineImage(tpl, image1, height=Mm(30),width=Mm(30))
    context["data"]["rtext"] = RichText(rtext,color='FF0000')
    context["data"]["text_bold"] = RichText(text_bold, color='FF0000', bold=True)
except Exception as e:
    print(e)

try:
    tpl.render(context)
    tpl.save(output_docx_file)
    print("true")

    #permet d'ouvrir le document word
   # os.startfile(output_docx_file)
except Exception as e:
    print("err => Report : "+e)