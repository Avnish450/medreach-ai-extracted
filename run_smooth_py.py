import pexpect
import sys

child = pexpect.spawn('npx -y smoothui-cli add siri-orb', encoding='utf-8', timeout=120)
child.logfile = sys.stdout

try:
    child.expect('Install 2 components')
    child.send('\r')
    child.expect(pexpect.EOF)
except Exception as e:
    print(e)
