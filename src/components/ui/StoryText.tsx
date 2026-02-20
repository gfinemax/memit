import React from 'react';

interface StoryTextProps {
    text: string;
    className?: string;
}

/**
 * AI가 생성한 스토리에서 **강조** 표시된 텍스트를 파싱하여 스타일링하는 컴포넌트입니다.
 * Electric Cyan (사이언 블루) 스타일을 사용하여 강조합니다.
 */
const StoryText: React.FC<StoryTextProps> = ({ text, className = "" }) => {
    if (!text) return null;

    // **텍스트** 패턴을 찾아 분할합니다.
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return (
        <span className={className}>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    // 마크다운 마커를 제거하고 강조 스타일을 적용합니다.
                    const content = part.slice(2, -2);
                    return (
                        <span
                            key={i}
                            className="text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                        >
                            {content}
                        </span>
                    );
                }
                return part;
            })}
        </span>
    );
};

export default StoryText;
