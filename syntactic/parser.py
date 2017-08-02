# encoding: utf-8

import nltk
import re
from nltk.tokenize import StanfordTokenizer
from nltk.tag import StanfordPOSTagger
from nltk.parse.stanford import StanfordParser,Tree
from nltk.parse.stanford import StanfordDependencyParser,DependencyGraph

# default_rules=[{'items':[{'attr': "context",'reg': "ROOT\/S\/S\/VP\/VBG"}],'tag':'first word'}]

def dependency_test(sentence='Drawing on those reports and the early reactions of Member States, as well as my own conviction that our work must be based on respect for human rights, I put forward six months ago a balanced set of proposals for decisions at this summit'):
	help(StanfordParser)
	tokenizer=StanfordTokenizer()
	tokens=tokenizer.tokenize(sentence)
	parser=StanfordDependencyParser()
	tree=list(parser.parse(tokens))

def parse(text,type='phrase'):
	# 分词
	tokenizer=StanfordTokenizer()
	tokens=tokenizer.tokenize(text)
	# 短语句法分析
	if type=='phrase':
		parser = StanfordParser()
	# 依存句法分析	
	elif 0 and type=='dependency':
		parser = StanfordDependencyParser()	
	tree=list(parser.parse(tokens))[0]
	result=tree_analysis(tree)
	return result

def tree_analysis(tree):
	if not isinstance(tree,Tree):
		return None
	result=[]	
	path_list=tree.treepositions('leaves')
	for path in path_list:
		word={}
		context=[]
		now=tree
		for pos in path:
			context.append(now.label())
			now=now[pos]
		word['path']='/'.join(context)
		word['value']=now
		word['pos']=context[-1]
		result.append(word)
	return result					
		
