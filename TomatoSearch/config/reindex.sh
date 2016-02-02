./delete.sh
./mapping.sh
python output.py | logstash -f logstash.conf
