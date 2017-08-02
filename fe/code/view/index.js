/**
 * Created by yaoyi on 2017/8/1.
 */
import React, {Component} from 'react';
import {Provider} from 'react-redux';

import 'antd/dist/antd.css';
import s from './index.less';
import ts from './translate/index.less';

import {Row,Col,Button,Select} from 'antd';
const Option=Select.Option;
import Translate from './translate';
import Analysis from './analysis';
import AnalysisConfig from './analysis-config';

const lans={
    en:'英文',
    zh:'中文',
};
const antonym=((src)=>{
    let antonym={};
    Object.keys(src).forEach(key=>{
        antonym[key]=src[key];
        antonym[src[key]]=key;
    });
    return antonym;
})({
    'from':'to',
    'zh':'en'
});


export default class Root extends Component {
    constructor(props){
        super(props);
        this.state={
            from:'en',
            to:'zh',
            text:'',
            rules:[]
        };
    }
    onChangeFromOrTo(target,value){
        this.setState({
            [target]:value,
            [antonym[target]]:antonym[value]
        })
    }
    onTranslate(types){
        let {from,to,text}=this.state;
        if(types=='all'){
            types='google,baidu,bing,analysis'.split(',')
        }
        if(typeof types=='string'){
            types=[types];
        }
        types.forEach(type=>{
            if(type=='analysis'){
                this.onAnalysis();
            }
            else{
                if(this.refs[type]!=null&&typeof this.refs[type].translate=='function'){
                    this.refs[type].translate(from,to,text);
                }
            }
        })
    }
    onAnalysis(){
        const {text}=this.state;
        let rules=[];
        if(this.refs.analysisConfig!=null&&typeof this.refs.analysisConfig.getRules=='function'){
            rules=this.refs.analysisConfig.getRules();
        }
        if(this.refs.analysis!=null&&typeof this.refs.analysis.analysis=='function'){
            this.refs.analysis.analysis(text,rules);
        }
    }
    render(){
        const {from,to,text}=this.state;
        return (
            <div className={s.root}>
                <div className={s.nav}>翻译工具</div>
                <div className={s.content}>
                    <Row className={s.row} gutter={20}>
                        <Col span={12}>
                            <div className={s.area}>
                                <div className={s.title}>源文本</div>
                                <textarea className={s.text} value={text} onChange={e=>{
                                    this.setState({text:e.target.value});
                                }}></textarea>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className={s.area}>
                                <div>
                                    <div className={s.title}>操作</div>
                                    <div>
                                        <Select
                                            className={s.select}
                                            size="large"
                                            value={from}
                                            onChange={this.onChangeFromOrTo.bind(this,'from')}
                                        >
                                            {
                                                Object.keys(lans).map(key=>{
                                                    return (
                                                        <Option key={key} value={key}>{lans[key]}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                        <Select
                                            className={s.select}
                                            size="large"
                                            value={to}
                                            onChange={this.onChangeFromOrTo.bind(this,'to')}
                                        >
                                            {
                                                Object.keys(lans).map(key=>{
                                                    return (
                                                        <Option key={key} value={key}>{lans[key]}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                        <div className={s.btns}>
                                            <Button
                                                className={s.btn}
                                                type="primary"
                                                size="large"
                                                onClick={this.onTranslate.bind(this,'all')}
                                            >全部功能</Button>
                                            <Button
                                                className={s.btn}
                                                size="large"
                                                onClick={this.onTranslate.bind(this,'google')}
                                            >Google</Button>
                                            <Button
                                                className={s.btn}
                                                size="large"
                                                onClick={this.onTranslate.bind(this,'baidu')}
                                            >Baidu</Button>
                                            <Button
                                                className={s.btn}
                                                size="large"
                                                onClick={this.onTranslate.bind(this,'bing')}
                                            >Bing</Button>
                                            <Button
                                                className={s.btn}
                                                size="large"
                                                onClick={this.onAnalysis.bind(this)}
                                            >句法分析</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row className={s.row} gutter={20}>
                        <Col span={12}>
                            <div className={s.area}>
                                <div className={s.title}>Google</div>
                                <Translate type="google" ref="google"/>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className={s.area}>
                                <div className={s.title}>Baidu</div>
                                <Translate type="baidu" ref="baidu"/>
                            </div>
                        </Col>
                    </Row>
                    <Row className={s.row} gutter={20}>
                        <Col span={12}>
                            <div className={s.area}>
                                <div className={s.title}>Bing</div>
                                <Translate type="bing" ref="bing"/>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className={s.area}>
                                <div className={s.title}>句法分析</div>
                                <Analysis ref="analysis"/>
                            </div>
                        </Col>
                    </Row>
                    <Row className={s.row} gutter={20}>
                        <Col span={24}>
                            <div className={s.area} style={{height:'auto',overflow:'hidden'}}>
                                <div className={s.title}>句法分析配置</div>
                                <AnalysisConfig ref="analysisConfig"/>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}