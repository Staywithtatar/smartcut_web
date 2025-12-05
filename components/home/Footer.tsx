import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
    return (
        <footer className="bg-[rgb(10,10,20)] text-gray-300 py-12 px-4 border-t border-white/10">
            <div className="container mx-auto max-w-6xl">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="w-10 h-10 rounded-xl overflow-hidden group-hover:scale-110 transition-transform">
                                <Image
                                    src="/logo.png"
                                    alt="Hedcut"
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-xl font-bold text-gradient-electric">Hedcut</span>
                        </Link>
                        <p className="text-sm text-gray-400">
                            🍄 AI ตัดต่อวิดีโอให้คุณอัตโนมัติ
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">ลิงก์</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/upload" className="text-gray-400 hover:text-[rgb(0,255,180)] transition-colors">
                                    เริ่มตัดต่อ
                                </Link>
                            </li>
                            <li>
                                <Link href="#features" className="text-gray-400 hover:text-[rgb(0,255,180)] transition-colors">
                                    ฟีเจอร์
                                </Link>
                            </li>
                            <li>
                                <Link href="#how-it-works" className="text-gray-400 hover:text-[rgb(0,255,180)] transition-colors">
                                    วิธีใช้งาน
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">ข้อมูล</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/upload" className="text-gray-400 hover:text-[rgb(0,255,180)] transition-colors">
                                    งานของฉัน
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-[rgb(0,255,180)] transition-colors">
                                    เกี่ยวกับเรา
                                </a>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-[rgb(0,255,180)] transition-colors">
                                    ติดต่อ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">สนับสนุน</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-[rgb(0,255,180)] transition-colors">
                                    คำถามที่พบบ่อย
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-[rgb(0,255,180)] transition-colors">
                                    คู่มือการใช้งาน
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Hedcut 🍄 สงวนลิขสิทธิ์.</p>
                </div>
            </div>
        </footer>
    )
}
