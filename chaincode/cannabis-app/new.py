import xml.etree.ElementTree as ET

tree = ET.parse('./requiredSar.xml')
root = tree.getroot()
print(root.attrib)

for child in root:
    print("NEW: ")
    print(child.tag)
    print(child.attrib)
