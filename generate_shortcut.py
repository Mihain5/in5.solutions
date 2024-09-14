# generate_shortcut.py

import json
import plistlib
import base64
from flask import Flask, request, send_file, render_template_string
from io import BytesIO

app = Flask(__name__)

@app.route('/shortcutcreator', methods=['GET', 'POST'])
def shortcut_creator():
    if request.method == 'POST':
        json_input = request.form['json_input']
        try:
            shortcut_data = json.loads(json_input)
            plist_data = plistlib.dumps(shortcut_data, fmt=plistlib.FMT_BINARY)
            file_buffer = BytesIO(plist_data)
            file_buffer.seek(0)
            return send_file(
                file_buffer,
                as_attachment=True,
                attachment_filename='shortcut.shortcut',
                mimetype='application/octet-stream'
            )
        except Exception as e:
            return f"Error: {e}"

    return '''
        <form method="post">
            <textarea name="json_input" rows="20" cols="80"></textarea><br>
            <input type="submit" value="Create Shortcut File">
        </form>
    '''

if __name__ == '__main__':
    app.run()
