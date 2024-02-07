import React, { FC, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import gfm from 'remark-gfm';

interface MarkdownRenderProps {
  children: string;
}

const MarkdownRender: FC<MarkdownRenderProps> = ({ children }) => {
  const components = useMemo(() => {
    return {
      code({ node, inline, className, children, language, ...props }: any) {
        const match = /language-(\w+)/.exec(className || '') ?? ['', 'bash'];
        return !inline && match ? (
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            showLineNumbers
            children={String(children).replace(/\n$/, '')}
            lineNumberStyle={{
              textAlign: 'left',
              paddingLeft: '0px',
            }} // 左对齐，增加左边距
            {...props}
          />
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
    };
  }, []);

  return (
    <ReactMarkdown
      components={components}
      remarkPlugins={[gfm]}
      children={children}
    />
  );
};

export default MarkdownRender;
