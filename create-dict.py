#find file

input_file = open("post-text.txt", "r")

#read file

#create a dictionary

#for loop: for line in file



output_file = open("post-output.txt", "w")

output_str = "{\n"

for line in input_file:

  if len(line) > 1:
      #key: index 1 in split on "

      key_unselected = line.split('"')
      print key_unselected
      key = key_unselected[1].strip()
      #value: index 0 in split on =, strip out whitespace
      value = line.split('=')[0].strip()
      #add key, value to dictionary
      output_str += "'" + key + "' : '" + value + "', "

output_str = output_str[0:-2] + "\n}"

output_file.write(output_str)

output_file.close()
