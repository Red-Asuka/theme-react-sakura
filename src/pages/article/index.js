import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import marked from 'marked';
import hljs from 'highlight.js';
import {ArticleWrapper, ArticleTop, MainWrapper} from './style';
import {actionCreators} from './store';
import {getTime} from '../../lib/public';
import 'highlight.js/styles/atom-one-dark.css'
import {Spin} from 'antd';
import Tocify from './tocify';
import Comments from './components/Comments';

const tocify = new Tocify();

class Article extends PureComponent {
    render() {
        const {content} = this.props;
        return (
            <ArticleWrapper>
                <div className='pattern-center-blank'/>
                <ArticleTop>
                    <div className='pattern-attachment-img'>
                        <img className='lazyload' src={require('../../statics/images/list_01.jpg')} alt=""/>
                    </div>
                    <div className='single-header'>
                        <h1 className='entry-title'>{content.title}</h1>
                        <p className='entry-census'>
                            <span>by05021</span>
                            <span className="bull">·</span>
                            <span>{getTime(content.createTime)}</span>
                            <span className="bull">·</span>
                            <span>{content.views} 次阅读</span>
                        </p>
                    </div>
                </ArticleTop>
                <MainWrapper>
                    {content ?
                        <div className='flex-items'>
                            <div className='cell'>
                                <div className='entry-content'
                                     dangerouslySetInnerHTML={{__html: marked(content.content)}}
                                />
                                <Comments id={this.props.match.params.id}/>
                            </div>
                            {tocify && tocify.render()}
                        </div> : this.Spin()
                    }
                </MainWrapper>
            </ArticleWrapper>
        )
    }


    componentDidMount() {
        const id = this.props.match.params.id;
        this.props.getDetail(id);
        const renderer = new marked.Renderer();
        renderer.heading = (text, level) => {
            const anchor = tocify.add(text, level);
            return `<h${level} id="${anchor}">${text}</h${level}>`;
        };
        marked.setOptions({
            renderer: renderer,
            highlight: code => hljs.highlightAuto(code).value
        });
    }

    componentWillUnmount() {
        this.props.delDetail();
        tocify.reset();
    }

    Spin() {
        return (
            <div className="example">
                <Spin size="large"/>
            </div>
        )
    }
}

const mapState = (state) => {
    return {
        content: state.getIn(['article', 'content'])
    }
};

const mapDispatch = (dispatch) => {
    return {
        getDetail(id) {
            dispatch(actionCreators.getDetail(id));
        },
        delDetail() {
            dispatch(actionCreators.delDetail());
        }
    }
};

export default connect(mapState, mapDispatch)(Article);
