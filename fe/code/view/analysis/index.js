/**
 * Created by yaoyi on 2017/8/1.
 */
import React, {Component} from 'react';
import s from '../translate/index.less';
import http from 'wrapper/http';

export default class Analysis extends Component {
    constructor(props){
        super(props);
        this.state={
            status:'idle',
            content:''
        };
    }
    analysis(text,rules){
        const {status}=this.state;
        if(status!='idle')return;
        this.setState({status:'pending'});
        const {type}=this.props;
        let url=`${window.location.protocol}//${window.location.hostname}:9001/syntactic_analysis`;
        http
            .post(url,JSON.stringify({
                text,
                rules
            }))
            .then(result=>{
                if(result.status==200&&result.data.errorCode==0&&result.data.data.length>0){
                    return result.data.data;
                }
                else{
                    throw Error();
                }
            })
            .then(data=>{
                let html='';
                data.forEach(item=>{
                    let finalStyles='';
                    rules.forEach((rule,i)=>{
                        const {styles,details}=rule;
                        let hasStyles=false;
                        let tmp='';
                        Array.isArray(styles)&&styles.forEach((style,i)=>{
                            tmp+=`${style.attr}:${style.value};`;
                        });
                        Array.isArray(details)&&details.forEach((detail,i)=>{
                            if(i==0)hasStyles=true;
                            hasStyles=hasStyles&&new RegExp(detail.reg).test(item[detail.attr]);
                        });
                        if(hasStyles){
                            finalStyles+=tmp;
                        }
                    });
                    html+=`<span class="${s.word}" style="${finalStyles}">${item.value}</span> `;
                });
                return html;
            })
            .catch(e=>{
                return '<span style="color:red;">分析失败</span>'
            })
            .then(html=>{
                this.setState({
                    status:'idle',
                    content:html
                });
            })
    }
    render() {
        const {content,status}=this.state;
        let html=content;
        if(status=='pending'){
            html='<span style="color:#999">分析中...</span>';
        }

        return (
            <div className={s.root} dangerouslySetInnerHTML={{__html:html}}></div>
        );
    }
}