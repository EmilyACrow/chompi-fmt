import os, shutil
from ChompiBack import app

def export(request):
    data = request.json
    samples = data.get('samples')
    export_path = data.get('export_path')
    sample_path = os.path.join(app.instance_path, 'samples')

    for sample in samples:
        filename = sample.get('filename')
        sampler = sample.get('sampler')
        bank = sample.get('bank')
        slot = sample.get('slot')

        # Format filename
        bankLetter = chr(bank + 97) # Convert bank number to letters a,b, or c
        formattedName = sampler + '_' + bankLetter + str(slot) + filename[-4:]

        # Export sample to export path
        shutil.copy(
            os.path.join(sample_path, filename),
            os.path.join(export_path, formattedName)
        )

## Export JSON format
    # Samples
        # Sample
            # filename
            # sampler
            # bank
            # slot
    # Export path