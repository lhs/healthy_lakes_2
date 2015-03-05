import csv
import datetime
import time

# Create the storage for the script
watershed = []
nearshore = []
openwater = []
lakebottom = []

# urls to cache file
image_urls = []

# Loop through and create all the text
with open('data.csv', 'r') as f:
    reader = csv.reader(f)
    for row in reader:
        place_type = row[2]
        if row[4] != '' and row[4] != 'Source link 1 - Image URL':
            imageUrl = 'card_images/'+row[4]
            image_urls.append(imageUrl+'\n')
            if place_type == 'Watershed':
                div = '\t\t<div id="watershed-card" class="card" style="display: none;">'
                picture = '\t\t\t<img id="pic" class="pic" src="'+imageUrl+'"  width="280" height="140">'
                title = '\t\t\t<div id= "title" class="title" align="center">'+ row[0] +'</div>'
                description = '\t\t\t<p id="hidden-text" style="display: none;"> '+row[1]+' </p>'
                close_div = '\t\t</div>'
                card = div+'\n'+picture+'\n'+title+'\n'+description+'\n'+close_div+'\n'
                watershed.append(card)
            elif place_type  == 'Nearshore':
                div = '\t\t<div id="nearshore-card" class="card" style="display: none;">'
                picture = '\t\t\t<img id="pic" class="pic" src="'+imageUrl+'"  width="280" height="140">'
                title = '\t\t\t<div id= "title" class="title" align="center">'+ row[0] +'</div>'
                description = '\t\t\t<p id="hidden-text" style="display: none;"> '+row[1]+' </p>'
                close_div = '\t\t</div>'
                card = div+'\n'+picture+'\n'+title+'\n'+description+'\n'+close_div+'\n'
                nearshore.append(card)
            elif place_type  == 'Open Water':
                div = '\t\t<div id="openwater-card" class="card" style="display: none;">'
                picture = '\t\t\t<img id="pic" class="pic" src="'+imageUrl+'"  width="280" height="140">'
                title = '\t\t\t<div id= "title" class="title" align="center">'+ row[0] +'</div>'
                description = '\t\t\t<p id="hidden-text" style="display: none;"> '+row[1]+' </p>'
                close_div = '\t\t</div>'
                card = div+'\n'+picture+'\n'+title+'\n'+description+'\n'+close_div+'\n'
                openwater.append(card)
            elif place_type  == 'Lake Bottom':
                div = '\t\t<div id="deepwater-card" class="card" style="display: none;">'
                picture = '\t\t\t<img id="pic" class="pic" src="'+imageUrl+'"  width="280" height="140">'
                title = '\t\t\t<div id= "title" class="title" align="center">'+ row[0] +'</div>'
                description = '\t\t\t<p id="hidden-text" style="display: none;"> '+row[1]+' </p>'
                close_div = '\t\t</div>'
                card = div+'\n'+picture+'\n'+title+'\n'+description+'\n'+close_div+'\n'
                lakebottom.append(card)

# Open all the strings up
start = open('doc_parts/start.html', 'r')

# watershed
watershed_start = open('doc_parts/watershed_start.html', 'r')

out_str = start.read() + watershed_start.read()
for card in watershed:
    out_str+=card
out_str += '\n\t</div>\n\t<!-- end of watershed -->\n'
watershed_start.close()

# nearshore
nearshore_start = open('doc_parts/nearshore_start.html', 'r')

out_str += nearshore_start.read()
for card in nearshore:
    out_str+=card
out_str += '\n\t</div>\n\t<!-- end of nearshore -->\n'
nearshore_start.close()

# openwater
openwater_start = open('doc_parts/openwater_start.html', 'r')

out_str += openwater_start.read()
for card in openwater:
    out_str+=card
out_str += '\n\t</div>\n\t<!-- end of openwater -->\n'
openwater_start.close()

# deepwater
deepwater_start = open('doc_parts/deepwater_start.html', 'r')

out_str += deepwater_start.read()
for card in lakebottom:
    out_str+=card
out_str += '\n\t</div>\n\t<!-- end of deepwater -->\n'
deepwater_start.close()

# end
end = open('doc_parts/end.html', 'r')
out_str += end.read()
end.close()

out = open('out.html', 'w')
out.write(out_str)
out.close()

# cache file
cache_manifest = open('start_manifest.appcache', 'r')

cache_str = 'CACHE MANIFEST\n'

today = datetime.date.today()
year = today.year
month = today.month
day = today.day

cache_str += '# '+str(year)+'-'+str(month)+'-'+str(day)+' '
cache_str += time.strftime("%H:%M:%S")+'\n'

cache_str += cache_manifest.read()
for url in image_urls:
    cache_str += url
cache_str += '\n'
cache_manifest.close()

cache_output = open('manifest.appcache', 'w')
cache_output.write(cache_str)
cache_output.close()