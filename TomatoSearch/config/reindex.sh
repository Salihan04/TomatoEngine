./delete.sh
./mapping.sh
python movie_output.py | logstash -f movie_logstash.conf
python output.py | logstash -f logstash.conf
