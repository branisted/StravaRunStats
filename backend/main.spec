# -*- mode: python ; coding: utf-8 -*-

import sys
import platform
import os
from PyInstaller.building.build_main import Analysis, EXE

# Platform detection
is_windows = platform.system() == 'Windows'
is_linux = platform.system() == 'Linux'

# Common configurations
common_settings = {
    'scripts': ['main.py'],
    'pathex': [os.getcwd()],
    'hiddenimports': [],
    'datas': [],
    'binaries': [],
}

# Platform-specific adjustments
if is_windows:
    common_settings['datas'] += [('static/*', 'static')]
    common_settings['binaries'] += [('tesseract/*', 'tesseract')]
    icon = 'windows_icon.ico'
    console = False
elif is_linux:
    common_settings['datas'] += [('static/*', 'static')]
    icon = None
    console = True

# Analysis and build
a = Analysis(**common_settings)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='main',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
