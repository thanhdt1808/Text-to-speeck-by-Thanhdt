import React, { useRef } from 'react';
import { UploadIcon, TrashIcon, RefreshIcon } from './Icons';

interface TextInputProps {
  text: string;
  setText: (text: string) => void;
}

export const TextInput: React.FC<TextInputProps> = ({ text, setText }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
    };

    if (file.name.endsWith('.txt') || file.name.endsWith('.srt')) {
      reader.readAsText(file);
    } else {
        // Fallback cho demo, giả sử file đọc được dưới dạng text
        reader.readAsText(file);
    }
  };

  const generateRandomText = () => {
    const texts = [
      "Xin chào, đây là một ví dụ về công nghệ chuyển văn bản thành giọng nói tiên tiến sử dụng trí tuệ nhân tạo Gemini.",
      "Trăm năm trong cõi người ta, chữ tài chữ mệnh khéo là ghét nhau. Trải qua một cuộc bể dâu, những điều trông thấy mà đau đớn lòng.",
      "Công nghệ AI đang thay đổi cách chúng ta làm việc và học tập mỗi ngày, mang lại hiệu quả vượt trội.",
      "The quick brown fox jumps over the lazy dog."
    ];
    setText(texts[Math.floor(Math.random() * texts.length)]);
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-200">Nhập văn bản</h2>
        <div className="flex space-x-2">
            <button 
                onClick={generateRandomText}
                className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white"
                title="Văn bản ngẫu nhiên"
            >
                <RefreshIcon className="w-5 h-5" />
            </button>
            <button 
                onClick={() => setText('')}
                className="p-2 hover:bg-red-900/50 rounded-full text-gray-400 hover:text-red-400"
                title="Xóa văn bản"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm transition"
            >
                <UploadIcon className="w-4 h-4" />
                <span>Nhập file</span>
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".txt,.srt,.doc,.docx"
                onChange={handleFileUpload}
            />
        </div>
      </div>
      <textarea
        className="flex-1 w-full bg-gray-900 text-gray-100 p-4 rounded-md border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none font-mono text-sm leading-relaxed"
        placeholder="Nhập văn bản tại đây hoặc tải lên tệp (hỗ trợ Tiếng Việt/Tiếng Anh)..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-2 text-right text-xs text-gray-500">
        {text.length} ký tự
      </div>
    </div>
  );
};