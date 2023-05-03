import os 
list = os.listdir('.\\uploads')
# print(list)

for i in range(0, len(list)):
    os.remove('.\\uploads\\' + list[i])