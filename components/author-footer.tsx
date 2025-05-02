import { Facebook, Youtube, Linkedin, Instagram, MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthorFooter() {
  return (
    <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
      <div className="backdrop-blur-sm bg-white/30 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/20 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Yassir SARHANE</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">Graphic Designer</p>

            <div className="space-y-2">
              <p className="flex items-center">
                <span className="inline-block w-6 mr-2">📞</span>
                <a href="tel:+212774079856" className="hover:underline">
                  +212 774 079 856
                </a>
              </p>
              <p className="flex items-center">
                <span className="inline-block w-6 mr-2">📧</span>
                <a href="mailto:yaxsarhane@gmail.com" className="hover:underline">
                  yaxsarhane@gmail.com
                </a>
              </p>
              <p className="flex items-center">
                <span className="inline-block w-6 mr-2">🌐</span>
                <a href="http://sarhane.rf.gd/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  http://sarhane.rf.gd/
                </a>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="icon" asChild>
              <a
                href="https://web.facebook.com/yaxsarhane"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </Button>

            <Button variant="outline" size="icon" asChild>
              <a
                href="https://instagram.com/yaxsarhane"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </Button>

            <Button variant="outline" size="icon" asChild>
              <a
                href="https://www.youtube.com/@yaxsarhane"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </Button>

            <Button variant="outline" size="icon" asChild>
              <a
                href="https://ma.linkedin.com/in/yaxsarhane"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>

            <Button variant="outline" size="icon" asChild>
              <a
                href="https://api.whatsapp.com/send?phone=212774079856&text=Hello!"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </Button>

            <Button variant="outline" size="icon" asChild>
              <a href="https://t.me/yaxsarhane" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <Send className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} Yassir SARHANE. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
