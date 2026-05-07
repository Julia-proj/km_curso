export function FooterSection() {
  return (
    <footer className="border-t border-border py-10 md:py-12">
      <div className="km-container flex flex-col items-start justify-between gap-6 md:flex-row">
        <div>
          <div className="font-display text-2xl">
            HAIRLAB<span className="text-accent">.</span>
          </div>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Авторская система восстановления волос. Студия и обучение.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Елена Александрова. Все права защищены.
        </div>
      </div>
    </footer>
  )
}
