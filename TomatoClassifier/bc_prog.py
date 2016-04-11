from __future__ import division

import nltk
from nltk.corpus import wordnet as wn
from nltk.tokenize import word_tokenize

import re
import random
#########################################FUNCTIONS#####################################################
##############################################################################################################################################################
class bc_prog:

    def __init__(self):
        words=[s for s in wn.all_synsets(wn.NOUN) if  (s.name().find('-')==-1) and (s.name().find('_')==-1) and len(s.name().split('.')[0])<12]

        words2 = self.filter_basic_logic(words)
        # print(words2)

        a = list(set(words2))
        a  = self.remove_unwanted(a)

        self.basic_word_list = a




    def convert_all_to_basic(self,reviews):
        
        newReviews = []
        for review in reviews:
            tempReview = ""
            tokens = word_tokenize(review)
            for token in tokens:
                tempword = check_basic(token,self.basic_word_list)
                if tempword:
                    tempReview = tempReview + " " + tempword
                else:
                    tempReview = tempReview + " " +  token
            newReviews.append(tempReview)
        return newReviews

    def root_level_counter(self, word,count):#calculates the average number of levels it has below
            m = 0.0
            if len(word.hyponyms())==0:
                    return count
            else:
                    for s in word.hyponyms():
                            temp = self.root_level_counter(s,count+1)
                            m+=temp
                    m=m/len(word.hyponyms())
                    return m

    def check_percentage(self,leest,a):#calculates the number of hits it has against table 1
            num_found=0
            not_found=0
            for s in leest:
                    if(self.check_basic(s,a)!=None):
                            num_found+=1
                    else:
                            not_found+=1

            print ('percentage hit: ' + str((num_found/(len(leest)))*100))
            print ('percentage not hit',((not_found/(len(leest)))*100))
            print ('')

    def check_basic(self,word):#check if word is inside list
            for s in wn.synsets(word):
                    if s.name().split('.')[0] in word:
                            temps = s.name().split('.')[0]
                            try:
                                    self.basic_word_list.index(temps)
                                    return temps
                            except ValueError or TypeError:
                                    continue
            return None

    def RootLevelCounter(self,word,count):#return max no. of levels each syset has below(not used)
            m = 0.0
            if len(word.hyponyms())==0:
                    return count
            else:
                    for s in word.hyponyms():
                            temp = root_level_counter(s,count+1)
                            if temp>m:
                                    m=temp
                    return m

    def depth_avg(self,d):#calculates avg depth from root
            return (d.min_depth()+d.max_depth())/2.0

    def arm_power(self,d):#calculate the number of hyper and hyponym it sysnset has(not used)
            return len(d.hyponyms())+len(d.hypernyms())

    def hyp_ratio(self,d):#calculate the ratio of avg depth against avg tree size
            try:
                    return self.depth_avg(d)/(self.root_level_counter(d,0))
            except ZeroDivisionError:
                    return -1

    def filter_basic_logic(self,words):#MAIN basic logic process
            words2 = []
            for d in words:
                    if len(d.hyponyms())>1 and self.depth_avg(d)>5.4 and len(d.hypernyms())>0 and 9>=self.hyp_ratio(d)>4.2 and 1<=(self.root_level_counter(d,0))<2.2:
                            words2.append(d.name().split('.')[0])
            return words2

    def replace_redundancy(self,a):#replace repetition, digits and words of length less than 3 with blanks
            pwords ='123'
            count=0
            for s in range(len(a)):
                    if (pwords in a[s] and len(a[s])-len(pwords)!=3) or a[s].isdigit() or len(a[s])<3 or a[s]=='':
                            a[s]=''
                    else:
                            pwords = a[s]
            return a

    def replace_M_Abstractions(self,a):#replace words with granularity with blamnks
            granularity = ['er','ive','ity','sion','tion','ance','ence','ing','tive','logy','ssory','ssary','tant','ate','dity','dosis','sity','ture','bent','ness','ment','tory','ism','cess','ist','bess','tics','tor','dle','tal','ic','sis','age','ship','ability','acy','ian','less']
            for s in range(len(a)):
                    for g in granularity:
                            if len(a[s])>5 and a[s].find(g)>((len(a[s])/2)-1):
                                    a[s]=''
                                    break
            return a

    def replace_vowelless(self,a):#replace words with no vowels with blanks
            vowels = 'aeiou'
            for s in range(len(a)):
                    found_vowels=0
                    for c in a[s]:
                            if c in vowels:
                                   found_vowels=1
                                   break
                    if(found_vowels==0):
                            a[s]=''
            return a

    def remove_replaced(self,a):#remove blanks
            removal_count = a.count('')
            for s in range(removal_count):
                a.remove('')
            return a

    def remove_unwanted(self,a):#removal of redundancy in proper steps
            a = self.replace_M_Abstractions(a)
            a = self.replace_redundancy(a)
            a = self.replace_vowelless(a)
            a = self.remove_replaced(a)
            return a

    def under_abstraction(self,d):#return true if synset is under abstraction.n.06(not used)
            abstraction = wn.synset('abstraction.n.06')
            result = False
            for h in d.hypernym_paths():
                    if abstraction in h:
                            result = True
                            break
            return result

    def random_sample(self,n,a):#print and save sample
            bc_sample = open("bc_sample.tab","w")
            for n in range(10):
                    word = random.choice(a)
                    bc_sample.write(word + '\n')
                    print (word)
            bc_sample.close()

    def store_list(self,a):#save entire bc list list
            bc_list = open("bc_list.tab","w")
            for word in a:
                    bc_list.write(word +'\n')
            bc_list.close()

    #############################################################################################################################################################
    def convert_all_to_basic(reviews):
        print("Process Started")
        print("Gettin all nouns....")
        words=[s for s in wn.all_synsets(wn.NOUN) if  (s.name().find('-')==-1) and (s.name().find('_')==-1) and len(s.name().split('.')[0])<12]

        print("Processing basic logic probability...")
        words2 = []
        filter_basic_logic(words,words2)

        print("Removing redundancy...")
        a = list(set(words2))
        a.sort()
        remove_unwanted(a)
        newReviews = []
        for review in reviews:
            tempReview = ""
            tokens = word_tokenize(review)
            for token in tokens:
                tempword = check_basic(token,a)
                if tempword:
                    tempReview = tempReview + " " + tempword
                else:
                    tempReview = tempReview + " " +  token
            newReviews.append(tempReview)
        return newReviews



    # #import list of basics and superordinates and subordinates from table
    # basic_list = []
    # superordinate = []
    # subordinate = []
    # temp=[]
    # for line in open('table_1.txt','r'):
    #         line = line.replace('\n', '')
    #         line = line.replace(' ','_')
    #         temp= line.split('\t')
    #         try:
    #                 basic_list.append(temp[1])
    #                 superordinate.append(temp[0])
    #                 subordinate.append(temp[2])
    #         except IndexError:
    #                 continue
    # basic_list=list(set(basic_list))
    # subordinate=list(set(subordinate))
    # superordinate=list(set(superordinate))


    # ###print hits on table
    # print ''
    # print("hits for basic words: ")          
    # check_percentage(basic_list,a)
    # print("hits for subordinate words: ") 
    # check_percentage(subordinate,a)
    # print("hits for superordinate words: ") 
    # check_percentage(superordinate,a)
    # print 'No. of words: ',len(a)

    # ##sample
    # print("Sample:")
    # random_sample(10,a)
    # print("Random sample list saved!")
    # store_list(a)
    # print("BC list saved!!")
    # print('')

    # #manual checking
    # while True:
    #         wordToBeC=str(raw_input("Enter word to be checked: "))
    #         tempword = check_basic(wordToBeC,a)
    #         if tempword==None:
    #                 print 'Not a basic word'
    #         else:
    #                 print 'Yes! ', tempword
