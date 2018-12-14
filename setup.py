# Copyright 2018 Francesco Ceccon
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# pylint: skip-file
from setuptools import setup, find_packages
from pathlib import Path

project_root = Path(__file__).resolve().parent

about = {}
version_path = project_root / 'galini_dashboard' / '__version__.py'
with version_path.open() as f:
    exec(f.read(), about)

with open('README.rst') as f:
    readme = f.read()

with open('CHANGELOG.rst') as f:
    changelog = f.read()

setup(
    name='galini-dashboard',
    author=about['__author__'],
    author_email=about['__author_email__'],
    license=about['__license__'],
    version=about['__version__'],
    url=about['__url__'],
    description=about['__description__'],
    long_description=readme + '\n\n' + changelog,
    packages=find_packages(exclude=['tests.*', 'tests']),
    entry_points={
        'console_scripts': [
            'galini-dashboard=galini_dashboard.main:main',
        ]
    },
    classifiers=[
        'Development Status :: 4 - Beta',
        'Intended Audience :: Science/Research',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Topic :: Scientific/Engineering :: Mathematics',
    ],
    install_requires=[
    ],
    setup_requires=['pytest-runner'],
    tests_require=['pytest', 'pytest-cov', 'pytest-rerunfailures'],
)
