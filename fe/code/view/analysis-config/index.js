/**
 * Created by yaoyi on 2017/8/1.
 */
import React, {Component} from 'react';
import s from './index.less';
import http from 'wrapper/http';
import Edit from './edit';
import EditStyle from './edit-style';
import {Button,message,Input} from 'antd';

export default class AnalysisConfig extends Component {
    constructor(props){
        super(props);
        this.state={
            edit: {
                open: false,
                form: []
            },
            editStyle: {
                open: false,
                form: []
            },
            rules:[]
        };
        this._columns=[
            {label:'样式规则'},
            {label:'校验规则'},
            {label:'操作',render:(record,index)=>{
                return <Button className={s.center} size="large" type="primary" onClick={()=>{
                    this.state.rules.splice(index,1);
                    this.forceUpdate();
                }}>删除</Button>
            }},
        ];
    }
    getRules(){
        return this.state.rules;
    }
    render() {
        const {rules,edit,editStyle}=this.state;

        return (
            <div>
                <div className={s.note}>
                    <div>校验规则指明对数据的哪些属性进行哪种校验，子规则之间是且的关系；样式规则指单词满足校验规则后附加在这些单词上的css样式。</div>
                    <div>数据的属性有：value，单词本身；pos，单词的词性标注；path，单词的词性路径。</div>
                    <div><a target="_blank" href="https://stackoverflow.com/questions/1833252/java-stanford-nlp-part-of-speech-labels">词性标注含义</a></div>
                </div>
                <table className={s.table} cellPadding="0" cellSpacing="0">
                    <thead>
                    <tr>
                        {
                            this._columns.map((column,i)=><th key={i}>{column.label}</th>)
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {
                        rules.map((rule,i)=>{
                            return (
                                <tr key={i}>
                                    {
                                        this._columns.map((column,j)=>{
                                            if(j==1){
                                                let label=rule.details.length>0?rule.details.map((item)=>{
                                                    return `${item.attr}:/${item.reg}/`;
                                                }).join(';'):'无'
                                                let style={transform:'translate(0,-100%)'};
                                                if(rule.btnVisible){
                                                    style={transform:'translate(0,0)'};
                                                }
                                                return (
                                                    <td key={i+','+j} onMouseOver={()=>{
                                                        rule.btnVisible=true;
                                                        this.forceUpdate();
                                                    }} onMouseOut={()=>{
                                                        rule.btnVisible=false;
                                                        this.forceUpdate();
                                                    }}>
                                                        {label}
                                                        <div className={s.ghosts} style={style}>
                                                            <Button type="primary" size="large" className={s.ghost} onClick={()=> {
                                                                this._latestEdit=i;
                                                                this.setState({
                                                                    edit: {
                                                                        open: true,
                                                                        form: rule.details
                                                                    }
                                                                });
                                                            }}>编辑</Button>
                                                        </div>
                                                    </td>
                                                )
                                            }
                                            else if(j==0){
                                                let label=rule.styles.length>0?rule.styles.map((item)=>{
                                                    return `${item.attr}:${item.value}`;
                                                }).join(';'):'无'
                                                let ss={transform:'translate(0,-100%)'};
                                                if(rule.styleBtnVisible){
                                                    ss={transform:'translate(0,0)'};
                                                }
                                                return (
                                                    <td key={i+','+j} onMouseOver={()=>{
                                                        rule.styleBtnVisible=true;
                                                        this.forceUpdate();
                                                    }} onMouseOut={()=>{
                                                        rule.styleBtnVisible=false;
                                                        this.forceUpdate();
                                                    }}>
                                                        {label}
                                                        <div className={s.ghosts} style={ss}>
                                                            <Button type="primary" size="large" className={s.ghost} onClick={()=> {
                                                                this._latestEditStyle=i;
                                                                this.setState({
                                                                    editStyle: {
                                                                        open: true,
                                                                        form: rule.styles
                                                                    }
                                                                });
                                                            }}>编辑</Button>
                                                        </div>
                                                    </td>
                                                )
                                            }
                                            else{
                                                return (
                                                    <td key={i+','+j}>
                                                        {column.render(rule,i)}
                                                    </td>
                                                );
                                            }
                                        })
                                    }
                                </tr>
                            );
                        })
                    }
                    {
                        rules.length<1&&<tr>
                            <td colSpan="4">
                                <div className={'ant-table-placeholder '+s['reset']}><span><i className="anticon anticon-frown-o"></i>暂无数据</span></div>
                            </td>
                        </tr>
                    }
                    </tbody>
                </table>
                <div>
                    <Button
                        className={s.btn}
                        type="primary"
                        size="large"
                        onClick={()=>{
                            this.state.rules.push({styles:[],details:[]});
                            this.forceUpdate();
                        }}>新增</Button>
                    <Button
                        className={s.btn}
                        type="primary"
                        size="large"
                        onClick={()=>{
                            window.localStorage['rules']=JSON.stringify(this.state.rules);
                            message.success('保存成功');
                        }}>保存到本地</Button>
                    <Button
                        className={s.btn}
                        type="primary"
                        size="large"
                        onClick={()=>{
                            let rules=null;
                            try{
                                rules=JSON.parse(window.localStorage['rules']);
                            }
                            catch(e){

                            }
                            if(Array.isArray(rules)){
                                this.setState({rules:rules});
                                message.success('读取成功');
                            }
                            else{
                                message.error('规则不存在');
                            }
                        }}>从本地读取</Button>
                </div>
                <Edit
                    onCancel={()=>{
                        this.state.edit.open=false;
                        this.forceUpdate();
                    }}
                    onSubmit={(data)=>{
                        this.state.rules[this._latestEdit].details=data;
                        this.forceUpdate();
                    }}
                    {...edit}
                />
                <EditStyle
                    onCancel={()=>{
                        this.state.editStyle.open=false;
                        this.forceUpdate();
                    }}
                    onSubmit={(data)=>{
                        this.state.rules[this._latestEditStyle].styles=data;
                        this.forceUpdate();
                    }}
                    {...editStyle}
                />
            </div>
        );
    }
}