import os, shutil
from ChompiBack import app
import tkinter as tk;
from tkinter import filedialog;
from pathlib import Path

## Export JSON format
        # Samples
            # filename
            # sampler
            # bank
            # slot

def export(request):
    data = request.json
    samples = data.get('samples')

    # Using TK to get a file explorer for import
    root = tk.Tk()
    root.attributes('-topmost', True)
    root.attributes('-alpha', 0)
    
    export_path = filedialog.askdirectory(initialdir='~/Downloads', title='Select export directory')
    
    root.withdraw()
    root.destroy()

    if export_path == '':
        return {
            "status": "error",
            "msg": "Export path not selected"
        }
    
    safe_to_overwrite = target_safe_to_overwrite(export_path)
        
    # If the directory is safe to overwrite, backup the directory then clear it
    if safe_to_overwrite:
        try:
            backup_export_dir(export_path)
            clear_export_dir(export_path)
        except OSError as e:
            return {
                "status": "error",
                "msg": "Could not overwrite backup directory"
            }
        
    # If the directory is not safe to overwrite, make sure the target directory at least exists then prep it
    if not safe_to_overwrite:
        if not os.path.exists(export_path):
            try:
                os.makedirs(export_path)
            except OSError as e:
                return {
                    "status": "error",
                    "msg": "Could not create directory " + export_path
                }
        
        # If the directory is not empty, create a subdirectory called 'chompi'
        else: 
            try:
                if os.path.exists(os.path.join(export_path, 'chompi')):
                    i = 1
                    while os.path.exists(os.path.join(export_path, f'chompi ({i})')):
                        i = i + 1
                        if i > 100:
                            return {
                                "status": "error",
                                "msg": "Could not create directory " + export_path
                            }
                    export_path = os.path.join(export_path, f'chompi ({i})')
                else:
                    export_path = os.path.join(os.path.abspath(export_path), 'chompi')
                os.makedirs(export_path)
            except OSError as e:
                return {
                    "status": "error",
                    "msg": "Could not create directory " + export_path
                }
    
    return export_samples(samples, export_path)

    

# Check if the directory is safe to format for Chompi
def target_safe_to_overwrite(path):
    # Return false if the path is not a directory, does not exist, or has subdirectories
    if not os.path.isdir(path) or not os.path.exists(path) or len(os.listdir(path)) != 0:
        return False
    
    # Return false if the directory contains files that are not .wav files
    for fname in os.listdir(path):
        if not fname.endswith('.wav'):
            return False
        
# Back up the export directory wav files. Passes exceptions to the caller
def backup_export_dir(path):
    try:
        shutil.rmtree(os.path.join(app.instance_path, 'backup'))   
        os.makedirs(os.path.join(app.instance_path, 'backup'))
        for filename in os.listdir(path):
            if filename.endswith('.wav'):
                shutil.copy2(
                    os.path.join(path, filename),
                    os.path.join(app.instance_path, 'backup', filename)
                )
    except OSError:
        raise

# Clear the export directory. Passes exceptions to the caller
def clear_export_dir(path):
    try:
        for filename in os.listdir(path):
            file_path = os.path.join(path, filename)
            os.remove(file_path)
    except OSError:
        raise

# Export samples to the export path. Returns a list of errors
def export_samples(samples, export_path):
    sample_path = os.path.join(app.instance_path, 'samples')
    errors = []

    for sample in samples:
        filename = sample.get('filename')
        sampler = sample.get('sampler')
        bank = sample.get('bank')
        slot = sample.get('slot')

        if not os.path.isfile(os.path.join(sample_path, filename)):
            errors.append({
                "filename": filename,
                "status": "error",
                "msg": "File does not exist",
                "path": os.path.join(sample_path, filename)
            })
            continue

        # Format filename
        bank_letter = chr(bank + 97) # Convert bank number to letters a,b, or c
        formatted_name = sampler + '_' + bank_letter + str(slot) + filename[-4:]

        # Export sample to export path
        try:
            shutil.copy2(
                os.path.join(sample_path, filename),
                os.path.join(export_path, formatted_name)
            )
        except OSError as e:
            errors.append({
                "filename": filename,
                "status": "error",
                "msg": "Could not copy file"
            })
    return errors
