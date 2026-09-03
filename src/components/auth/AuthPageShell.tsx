import React from 'react';
import { ArrowUpRight, Search } from 'lucide-react';

interface AuthPageShellProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

export const AuthPageShell: React.FC<AuthPageShellProps> = ({ leftContent, rightContent }) => {
  return (
    <div className="min-h-screen bg-[#B6E4E1] px-4 py-8 sm:px-6 lg:px-10 flex items-center justify-center">
      <div className="relative w-full max-w-[1180px] h-[760px] rounded-[34px] bg-[#F6F5F3] shadow-[0_30px_80px_rgba(12,26,26,0.15)] overflow-hidden border border-[#dfeae8]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.9),_transparent_35%)]" />

        <div className="relative z-10 flex h-full w-full items-center justify-between gap-10 px-8 py-8 sm:px-10 lg:px-12">
          <div className="hidden md:flex md:w-[48%] h-full items-center justify-center">
            {leftContent}
          </div>

          <div className="w-full md:w-[52%] flex items-center justify-center">
            <div className="w-full max-w-[420px]">{rightContent}</div>
          </div>
        </div>

        <div className="absolute bottom-6 left-8 z-20 flex items-center gap-3 rounded-full border border-[#1b2023] bg-[#f6f5f3] px-4 py-2 shadow-sm text-sm font-medium text-[#1d1f20]">
          <ArrowUpRight className="w-4 h-4" />
          <span>Visit site</span>
        </div>

        <div className="absolute bottom-6 right-8 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-[#1b2023] bg-[#f6f5f3] shadow-sm">
          <Search className="w-5 h-5 text-[#1d1f20]" />
        </div>
      </div>
    </div>
  );
};
