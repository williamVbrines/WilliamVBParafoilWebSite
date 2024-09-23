import os
import sys

def get_data(path):
    with open(path) as file:
        return file.read()
def output_data(data, path):
    with open(path, mode='w') as file:
        file.write(data)
        
def make_output(data_include, delimiter, file_data):
    start_index = file_data.find("<" + delimiter + ">")
    end_index = -1 
    
    
    if start_index == -1:
        return file_data
        
    end_index = file_data.find("</" + delimiter + ">", start_index)
    
    if end_index == -1:
         return file_data
    
    output = file_data[0:start_index]
    output += data_include
    output += make_output(data_include, delimiter, file_data[end_index + len(delimiter) + 3:len(file_data)])
    return output
   
def make_file_wrapper(data_include, delimiter, file_data):
    start_index = file_data.find("<" + delimiter + ">")
    end_index = -1 
    
    
    if start_index == -1:
        raise ValueError("ERROR delimiter <" + delimiter + "> not found in file")
        return file_data;
        
    end_index = file_data.find("</" + delimiter + ">", start_index)
    
    if end_index == -1:
        raise ValueError("ERROR delimiter </" + delimiter + "> not found in file")
        return file_data
         
    return make_output(data_include, delimiter, file_data)
    

  
def include(data_path, file_path, delimiter = ""):

    data_include = get_data(data_path)
    file_data = get_data(file_path)
        
    if delimiter == "":  
        end = sys.argv[1].find(".")
        if end == -1:
            delimiter = sys.argv[1]
        else:
            delimiter = sys.argv[1][0:end]
        
    output_data(make_file_wrapper(data_include, delimiter, file_data), file_path)  
  
if __name__ == '__main__':
    if len(sys.argv) >= 3:
        print(sys.argv)
        data_include = get_data(sys.argv[1]);
        file_data = get_data(sys.argv[2])
        delimiter = "";
        
        if len(sys.argv) >= 4:
            delimiter = sys.argv[3];
        else:
            end = sys.argv[1].find(".")
            if end == -1:
                delimiter = sys.argv[1];
            else:
                delimiter = sys.argv[1][0:end];
        
        output_data(make_file_wrapper(data_include, delimiter, file_data), sys.argv[2])
        
     
    elif len(sys.argv) == 2:
        raise ValueError("ERROR no output directory")
    elif len(sys.argv) >= 1:
        raise ValueError("ERROR no Input or Output directory")
        
