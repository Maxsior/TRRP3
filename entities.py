import os
import time


class Entity:
    name: str
    icon: str

    def __init__(self, name, icon):
        self.name = name
        self.icon = icon


entities = []


