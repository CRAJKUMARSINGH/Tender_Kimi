from setuptools import setup, find_packages

setup(
    name="tender-kimi-backend",
    version="0.1.0",
    packages=find_packages(include=['app*']),
    install_requires=[
        'fastapi==0.95.2',
        'uvicorn[standard]==0.22.0',
        'pydantic==1.10.7',
        'httpx==0.24.1',
        'pandas==2.0.3',
        'openpyxl==3.1.2',
        'python-multipart==0.0.6',
        'typing-extensions==4.5.0',
    ],
    extras_require={
        'test': [
            'pytest==7.4.0',
            'pytest-cov==4.1.0',
        ],
    },
    python_requires='>=3.8',
)
