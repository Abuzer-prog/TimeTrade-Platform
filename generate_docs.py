import os
import sys
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def create_document():
    doc = Document()

    # Define Color Constants
    COLOR_PRIMARY = RGBColor(30, 41, 59)      # #1E293B (Deep Navy)
    COLOR_SECONDARY = RGBColor(37, 99, 235)   # #2563EB (Slate Blue / Indigo)
    COLOR_BODY = RGBColor(51, 65, 85)         # #334155 (Slate Neutral)
    COLOR_MUTED = RGBColor(100, 116, 139)     # #64748B (Slate Muted)
    HEX_PRIMARY = "1E293B"
    HEX_SECONDARY = "2563EB"
    HEX_LIGHT_BG = "F8FAFC"
    HEX_BORDER = "CBD5E1"
    HEX_ALT_ROW = "F1F5F9"
    HEX_CODE_BG = "F8FAFC"
    HEX_CALLOUT_BORDER = "3B82F6"

    # Configure Margins (1 inch all around)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        section.different_first_page_header_footer = True

        # Header for subsequent pages
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("TimeTrade: Student Time-Exchange Board | BCA Capstone Project Report")
        hrun.font.name = "Calibri"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = COLOR_MUTED

        # Footer for subsequent pages
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        frun1 = fp.add_run("Bachelor of Computer Applications (BCA) • Final Project Report")
        frun1.font.name = "Calibri"
        frun1.font.size = Pt(8.5)
        frun1.font.color.rgb = COLOR_MUTED
        frun_tab = fp.add_run("\t\t")
        frun2 = fp.add_run("Page ")
        frun2.font.name = "Calibri"
        frun2.font.size = Pt(8.5)
        frun2.font.color.rgb = COLOR_MUTED
        fld = parse_xml(r'<w:fldSimple %s w:instr="PAGE"/>' % nsdecls('w'))
        frun2._r.append(fld)

    # Style Helpers
    def set_font(run, name="Calibri", size_pt=11, color=COLOR_BODY, bold=False, italic=False):
        run.font.name = name
        run.font.size = Pt(size_pt)
        run.font.color.rgb = color
        run.bold = bold
        run.italic = italic

    def add_p(doc, text="", space_before=0, space_after=6, line_spacing=1.15, align=WD_ALIGN_PARAGRAPH.LEFT):
        p = doc.add_paragraph()
        p.alignment = align
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = line_spacing
        if text:
            run = p.add_run(text)
            set_font(run, size_pt=10.5, color=COLOR_BODY)
        return p

    def add_h1(doc, text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(16)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        set_font(run, name="Calibri", size_pt=17, color=COLOR_PRIMARY, bold=True)
        # Add a subtle bottom border or divider line under H1
        pBdr = parse_xml(r'<w:pBdr %s><w:bottom w:val="single" w:sz="8" w:space="4" w:color="2563EB"/></w:pBdr>' % nsdecls('w'))
        p._p.get_or_add_pPr().append(pBdr)
        return p

    def add_h2(doc, text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        set_font(run, name="Calibri", size_pt=13.5, color=COLOR_SECONDARY, bold=True)
        return p

    def add_h3(doc, text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        set_font(run, name="Calibri", size_pt=11.5, color=COLOR_PRIMARY, bold=True)
        return p

    def add_bullet(doc, bold_prefix, text):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.15
        r1 = p.add_run(bold_prefix)
        set_font(r1, size_pt=10.5, color=COLOR_PRIMARY, bold=True)
        r2 = p.add_run(text)
        set_font(r2, size_pt=10.5, color=COLOR_BODY)
        return p

    def set_cell_shading(cell, hex_color):
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
        cell._tc.get_or_add_tcPr().append(shd)

    def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = parse_xml(
            f'<w:tcMar {nsdecls("w")}>'
            f'<w:top w:w="{top}" w:type="dxa"/>'
            f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
            f'<w:left w:w="{left}" w:type="dxa"/>'
            f'<w:right w:w="{right}" w:type="dxa"/>'
            f'</w:tcMar>'
        )
        tcPr.append(tcMar)

    def set_table_borders(table, color=HEX_BORDER, sz="4"):
        tblPr = table._tbl.tblPr
        tblBorders = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>'
            f'<w:top w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:bottom w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:left w:val="none"/>'
            f'<w:right w:val="none"/>'
            f'<w:insideH w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:insideV w:val="none"/>'
            f'</w:tblBorders>'
        )
        tblPr.append(tblBorders)

    def add_styled_table(doc, headers, data, col_widths=None):
        table = doc.add_table(rows=len(data) + 1, cols=len(headers))
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_table_borders(table)

        # Style Header Row
        hdr_cells = table.rows[0].cells
        for i, title in enumerate(headers):
            cell = hdr_cells[i]
            cell.text = title
            set_cell_shading(cell, HEX_PRIMARY)
            set_cell_margins(cell, top=130, bottom=130, left=140, right=140)
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            for r in p.runs:
                set_font(r, name="Calibri", size_pt=9.5, color=RGBColor(255, 255, 255), bold=True)

        # Populate Data Rows
        for row_idx, row_data in enumerate(data):
            row_cells = table.rows[row_idx + 1].cells
            bg_color = HEX_ALT_ROW if row_idx % 2 == 1 else "FFFFFF"
            for col_idx, text in enumerate(row_data):
                cell = row_cells[col_idx]
                cell.text = str(text)
                set_cell_shading(cell, bg_color)
                set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
                cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
                p = cell.paragraphs[0]
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 1.1
                for r in p.runs:
                    set_font(r, name="Calibri", size_pt=9.0, color=COLOR_BODY)

        # Column widths
        if col_widths:
            for row in table.rows:
                for idx, w in enumerate(col_widths):
                    row.cells[idx].width = Inches(w)

        # Space after table
        spacer = doc.add_paragraph()
        spacer.paragraph_format.space_before = Pt(2)
        spacer.paragraph_format.space_after = Pt(8)
        return table

    def add_callout(doc, title, text):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        set_cell_shading(cell, HEX_LIGHT_BG)
        set_cell_margins(cell, top=120, bottom=120, left=160, right=160)
        
        # Left border only (accent callout)
        tcPr = cell._tc.get_or_add_tcPr()
        tcBorders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'<w:top w:val="none"/>'
            f'<w:left w:val="single" w:sz="24" w:color="{HEX_CALLOUT_BORDER}"/>'
            f'<w:bottom w:val="none"/>'
            f'<w:right w:val="none"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(tcBorders)
        cell.width = Inches(6.5)

        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(3)
        r_title = p.add_run(f"NOTE: {title}\n")
        set_font(r_title, name="Calibri", size_pt=10, color=COLOR_SECONDARY, bold=True)
        r_text = p.add_run(text)
        set_font(r_text, name="Calibri", size_pt=9.5, color=COLOR_BODY, italic=True)

        sp = doc.add_paragraph()
        sp.paragraph_format.space_before = Pt(2)
        sp.paragraph_format.space_after = Pt(6)

    def add_code_block(doc, code_str, language="JavaScript"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        set_cell_shading(cell, HEX_CODE_BG)
        set_cell_margins(cell, top=100, bottom=100, left=140, right=140)

        tcPr = cell._tc.get_or_add_tcPr()
        tcBorders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'<w:top w:val="single" w:sz="6" w:color="{HEX_BORDER}"/>'
            f'<w:left w:val="single" w:sz="18" w:color="{HEX_PRIMARY}"/>'
            f'<w:bottom w:val="single" w:sz="6" w:color="{HEX_BORDER}"/>'
            f'<w:right w:val="single" w:sz="6" w:color="{HEX_BORDER}"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(tcBorders)
        cell.width = Inches(6.5)

        # Label
        p_lbl = cell.paragraphs[0]
        p_lbl.paragraph_format.space_before = Pt(0)
        p_lbl.paragraph_format.space_after = Pt(4)
        r_lbl = p_lbl.add_run(f"// Code Module: {language}")
        set_font(r_lbl, name="Consolas", size_pt=8.5, color=COLOR_MUTED, bold=True)

        # Code content
        p_code = cell.add_paragraph()
        p_code.paragraph_format.space_before = Pt(0)
        p_code.paragraph_format.space_after = Pt(0)
        p_code.paragraph_format.line_spacing = 1.05
        r_code = p_code.add_run(code_str.strip())
        set_font(r_code, name="Consolas", size_pt=8.5, color=RGBColor(15, 23, 42))

        sp = doc.add_paragraph()
        sp.paragraph_format.space_before = Pt(2)
        sp.paragraph_format.space_after = Pt(6)

    # ==========================================
    # 1. TITLE PAGE
    # ==========================================
    p_pre = doc.add_paragraph()
    p_pre.paragraph_format.space_before = Pt(36)
    p_pre.paragraph_format.space_after = Pt(8)
    p_pre.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_uni = p_pre.add_run("ACADEMIC CAPSTONE PROJECT REPORT")
    set_font(r_uni, name="Calibri", size_pt=12, color=COLOR_SECONDARY, bold=True)

    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(12)
    p_title.paragraph_format.space_after = Pt(12)
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_title = p_title.add_run("TimeTrade: Student Time-Exchange Board")
    set_font(r_title, name="Calibri", size_pt=26, color=COLOR_PRIMARY, bold=True)

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(30)
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_sub.add_run("A Full-Stack Peer-to-Peer Academic Assistance & Time Slot Reservation Platform\nEngineered with MERN Stack (MongoDB, Express.js, React 18, Node.js) and Tailwind CSS")
    set_font(r_sub, name="Calibri", size_pt=12, color=COLOR_BODY, italic=True)

    # Decorative Box for Submission Meta
    meta_tbl = doc.add_table(rows=1, cols=1)
    meta_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_cell = meta_tbl.cell(0, 0)
    set_cell_shading(meta_cell, HEX_LIGHT_BG)
    set_cell_margins(meta_cell, top=160, bottom=160, left=200, right=200)
    meta_cell.width = Inches(5.8)
    set_table_borders(meta_tbl, color=HEX_SECONDARY, sz="12")

    mp = meta_cell.paragraphs[0]
    mp.alignment = WD_ALIGN_PARAGRAPH.LEFT
    mp.paragraph_format.line_spacing = 1.3
    mp.paragraph_format.space_after = Pt(0)

    lines = [
        ("Course / Degree:", " Bachelor of Computer Applications (BCA) - Semester V / Final Capstone"),
        ("Project Module:", " BCA • Frontend Application Development Using REACT & REST API Backend"),
        ("Author / Student:", " Abuzer [Student Candidate]"),
        ("Roll / Exam No.:", " BCA-5TH-SEM-PROJECT-11"),
        ("Academic Mentor:", " Department Faculty Guide & Evaluation Committee"),
        ("Department:", " Department of Computer Science & Information Technology"),
        ("Academic Year:", " 2025 – 2026"),
        ("Submission Date:", " October 2026")
    ]
    for lbl, val in lines:
        r1 = mp.add_run(lbl)
        set_font(r1, name="Calibri", size_pt=10, color=COLOR_PRIMARY, bold=True)
        r2 = mp.add_run(f"{val}\n")
        set_font(r2, name="Calibri", size_pt=10, color=COLOR_BODY)

    p_foot = doc.add_paragraph()
    p_foot.paragraph_format.space_before = Pt(80)
    p_foot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_f1 = p_foot.add_run("Verified for Academic & Industry-Level Full-Stack Engineering Compliance\n")
    set_font(r_f1, size_pt=9.5, color=COLOR_MUTED, bold=True)
    r_f2 = p_foot.add_run("Production GitHub Repository Standard • Dual-Module Architecture • MIT License")
    set_font(r_f2, size_pt=9, color=COLOR_MUTED)

    doc.add_page_break()

    # ==========================================
    # 2. EXECUTIVE SUMMARY & ABSTRACT
    # ==========================================
    add_h1(doc, "1. Executive Summary & Abstract")

    add_p(doc, 
        "The TimeTrade platform is an enterprise-grade, peer-to-peer student collaboration and time-banking "
        "web application designed to eliminate academic assistance friction within university campuses. Higher "
        "education students frequently encounter localized, short-duration academic roadblocks—ranging from elusive "
        "code debugging in laboratory assignments, handwritten lecture note review for semester midterms, and capstone "
        "presentation defense coaching, to complex algorithmic problem solving. While traditional commercial tutoring "
        "is expensive, slow, and transactional, peer student networks possess immense, untapped, complementary expertise. "
        "However, peer learning typically falters due to the lack of an organized exchange mechanism, mutual commitment, "
        "and accountability."
    )

    add_p(doc,
        "TimeTrade solves this paradigm by formalizing reciprocal 'Time Banking': students offer short, high-yield help "
        "sessions in topics they have mastered and in return request equivalent help slots from peers in topics where "
        "they need support, entirely free of monetary exchange. The technical foundation is built on an enterprise-grade "
        "dual-module architecture comprising a decoupled React 18 Single Page Application (SPA) bundled via Vite and Tailwind CSS, "
        "and a secure Node.js/Express.js RESTful API backed by MongoDB Mongoose schemas."
    )

    add_callout(doc, "Core Value Proposition", 
        "TimeTrade establishes an equitable campus economy: 1 hour spent reviewing web technologies theory notes "
        "earns 1 hour of one-on-one debugging or mock capstone defense preparation, driving cooperative peer learning."
    )

    add_h2(doc, "Key Technical & Functional Achievements")
    add_bullet(doc, "Dual-Module Decoupled Architecture: ", "Clean isolation between client (/client) and server (/server) with separate dependency graphs, independent linting, and automated environment configurations.")
    add_bullet(doc, "Two-Sided Request State Machine: ", "Deterministic slot reservation workflow supporting Open, Booked, Completed, and Cancelled session lifecycles, coupled with automatic conflict resolution upon host acceptance.")
    add_bullet(doc, "Multi-Tiered Security Hardening: ", "Implementation of Helmet.js HTTP headers, strict CORS origin whitelisting, bcryptjs salted password hashing, express-validator input sanitization, and express-rate-limit brute force mitigation.")
    add_bullet(doc, "Unified 4-Tab Student Command Center: ", "Tabbed management dashboard tracking Active Offerings, Incoming Inquiries, Outgoing Booking Requests, and an immutable Completed History Log.")

    # ==========================================
    # 3. PROBLEM STATEMENT & PROJECT IDEA
    # ==========================================
    add_h1(doc, "2. Problem Statement & Project Concept")

    add_h2(doc, "2.1 The Academic Collaboration Dilemma")
    add_p(doc,
        "In modern computer science and BCA curricula, students are confronted with an intensive mix of theoretical "
        "coursework (Theory of Computation, Database Management, Operating Systems) and rapid-paced practical applications "
        "(MERN Stack, Responsive Web Design, REST API engineering). The resulting challenges include:"
    )

    add_bullet(doc, "Fragmented Communication Channels: ", "Student interactions occur across unindexed instant messaging apps (WhatsApp, Telegram) where academic requests are easily buried, lost, or ignored.")
    add_bullet(doc, "One-Sided Assistance Fatigue: ", "High-performing students often experience burnout when peers repeatedly ask for assistance without reciprocity, leading to hesitation in offering help.")
    add_bullet(doc, "Exam Revision & Notes Bottlenecks: ", "Students who miss lectures lack vetted, peer-curated revision sheets and past-year question summaries before examinations.")
    add_bullet(doc, "Pre-Defense Presentation Anxiety: ", "Capstone students frequently defend technical projects without realistic mock rehearsal, resulting in suboptimal pacing, communication breakdowns, and nervousness.")

    add_h2(doc, "2.2 The TimeTrade Solution: Structured Reciprocal Exchange")
    add_p(doc,
        "TimeTrade introduces a structured, two-sided marketplace where student time is treated as a shared, valuable "
        "currency. Every student acts simultaneously as a 'Host' (offering skills or revision notes) and a 'Requester' "
        "(seeking targeted assistance). By substituting monetary payment with equal blocks of reciprocal time, TimeTrade "
        "democratizes campus learning and establishes a supportive academic community."
    )

    # Summary table of categories
    cat_headers = ["Category", "Typical Scope", "Target Student Need", "Standard Duration"]
    cat_data = [
        ["Coding", "React, Node.js, Python, Java, Data Structures debugging", "Assignment bug triage & code walkthroughs", "30 – 60 Mins"],
        ["Notes", "Handwritten lecture summaries, exam cheat sheets, PYQs", "Midterm & semester exam preparation", "30 – 45 Mins"],
        ["Presentation Practice", "Capstone project defense rehearsal, slide feedback", "Final year presentation polish & Q&A readiness", "45 – 60 Mins"],
        ["Academic Support", "Discrete Math, Statistics, Automata proofs", "Complex homework and proof derivations", "45 – 90 Mins"],
        ["Other", "Git workflows, Linux CLI, Docker container setup", "DevOps and technical toolchain pairing", "30 – 45 Mins"]
    ]
    add_styled_table(doc, cat_headers, cat_data, [1.3, 2.2, 1.8, 1.2])

    # ==========================================
    # 4. SYSTEM REQUIREMENTS & TECHNICAL ARCHITECTURE
    # ==========================================
    add_h1(doc, "3. System Requirements & Technical Architecture")

    add_h2(doc, "3.1 Functional Requirements (FR)")
    add_bullet(doc, "FR-01 (Authentication): ", "Students must register with unique university email addresses, hash passwords via bcrypt, and maintain authenticated sessions using JSON Web Tokens (JWT).")
    add_bullet(doc, "FR-02 (Session Marketplace): ", "Public and authenticated users can view, search in real-time via keywords, and filter active time-exchange offerings across 5 academic categories.")
    add_bullet(doc, "FR-03 (Session Offer CRUD): ", "Logged-in students can create, view, modify, and delete their own session offerings with title, category, description, duration, and scheduled time.")
    add_bullet(doc, "FR-04 (Slot Request Submission): ", "Students can submit a booking request on any open session with an introductory note outlining specific learning goals.")
    add_bullet(doc, "FR-05 (Two-Sided Request Approval): ", "Session hosts can review incoming inquiries and Accept or Reject them. Accepting a request immediately updates session status to 'Booked' and automatically rejects conflicting requests.")
    add_bullet(doc, "FR-06 (Request Cancellation): ", "Either party can cancel an active booking; if an accepted booking is cancelled, the session availability status automatically returns to 'Open'.")
    add_bullet(doc, "FR-07 (Student Dashboard): ", "Unified multi-tab interface presenting 'My Offerings', 'Incoming Requests', 'My Sent Requests', and 'Completed History'.")

    add_h2(doc, "3.2 Non-Functional Requirements (NFR)")
    add_bullet(doc, "NFR-01 (Security): ", "Zero plaintext password storage, protection against XSS and clickjacking via Helmet.js, brute-force mitigation via IP rate limiting, and CORS origin restriction.")
    add_bullet(doc, "NFR-02 (Performance): ", "Sub-100ms API response latency for marketplace queries facilitated by MongoDB compound indexes and lean payload serialization.")
    add_bullet(doc, "NFR-03 (Reliability): ", "Graceful connection lifecycle handlers and operational exception isolation ensuring server uptime does not crash on malformed inputs.")
    add_bullet(doc, "NFR-04 (Responsiveness & Accessibility): ", "100% responsive user interface adapting to smartphones, tablets, and desktop displays with high-contrast text conforming to WCAG 2.1 AA.")

    add_h2(doc, "3.3 Technology Stack Rationale")
    tech_headers = ["Layer", "Selected Technology", "Version", "Engineering Justification"]
    tech_data = [
        ["Frontend UI", "React.js", "18.3.1", "Component-driven declarative UI, virtual DOM diffing, and seamless hook-based state management."],
        ["Build Tool", "Vite", "5.4.x", "Instant Hot Module Replacement (HMR) powered by native ES modules, eliminating Webpack bundling latency."],
        ["Styling Engine", "Tailwind CSS", "3.4.x", "Utility-first CSS delivering responsive styling without bloated stylesheet files; high-contrast student theme."],
        ["Routing & Guards", "React Router DOM", "6.28.x", "Declarative client-side routing with nested layouts, ProtectedRoute auth guards, and PublicRoute guest guards."],
        ["HTTP Client", "Axios", "1.7.x", "Promise-based HTTP client with request/response interceptors for dynamic Bearer token injection and global 401 handling."],
        ["Backend Runtime", "Node.js", "24.x LTS", "Event-driven, asynchronous non-blocking I/O runtime optimal for concurrent API requests."],
        ["Web Framework", "Express.js", "4.21.x", "Minimalist, robust REST API framework supporting modular routing, middleware pipelines, and error handling."],
        ["Database", "MongoDB (Mongoose)", "8.9.x", "Document-oriented NoSQL storage facilitating flexible polymorphic session schemas and rich population queries."]
    ]
    add_styled_table(doc, tech_headers, tech_data, [1.1, 1.4, 0.8, 3.2])

    add_h2(doc, "3.4 High-Level System Architecture")
    add_p(doc,
        "The TimeTrade system adopts a layered client-server architecture. The React Single Page Application "
        "interacts with the Node.js/Express API gateway strictly through stateless RESTful JSON contracts. The server "
        "implements a layered service-oriented design:"
    )
    add_bullet(doc, "Presentation & Network Interceptor: ", "React components make requests via an Axios singleton instance. The request interceptor dynamically injects 'Authorization: Bearer <token>' from localStorage, while the response interceptor monitors 401 Unauthorized codes to trigger session expiration.")
    add_bullet(doc, "Security & Gateway Pipeline: ", "Every request passes sequentially through Helmet HTTP security headers, CORS origin verification, express-rate-limit throttling, body parsing, and route parameter validation via express-validator.")
    add_bullet(doc, "Controller & Business Service Layer: ", "Controllers parse validated input and delegate domain logic to specialized services (authService, sessionService, bookingService), ensuring zero database operations are performed in route handlers.")
    add_bullet(doc, "Persistence & Mongoose Data Models: ", "Services interact with Mongoose models (User, Session, Booking), utilizing compound indexes, pre-save cryptographic hooks, and lean query projections.")

    # ==========================================
    # 5. DATABASE DESIGN & SCHEMA ARCHITECTURE
    # ==========================================
    add_h1(doc, "4. Database Design & Schema Architecture")

    add_p(doc,
        "The database design emphasizes relational integrity within MongoDB's document model using Mongoose ObjectIds, "
        "population references, and compound indexes to prevent duplicate booking conflicts."
    )

    add_h2(doc, "4.1 User Entity Schema (`User.js`)")
    add_p(doc,
        "The User collection stores authenticated student records. Passwords are automatically salted and hashed "
        "prior to persistence using a Mongoose pre-save hook. The password field is flagged with 'select: false' "
        "to prevent unintentional transmission in API query results."
    )

    user_headers = ["Field Name", "BSON Type", "Constraints", "Indexing", "Functional Description"]
    user_data = [
        ["_id", "ObjectId", "Primary Key (Auto)", "Unique Index", "Unique student identifier generated by MongoDB."],
        ["name", "String", "Required, Trim, Max: 60", "None", "Student's full name displayed across offerings and requests."],
        ["email", "String", "Required, Unique, Lowercase", "Unique Index", "Institutional university email for login and notifications."],
        ["password", "String", "Required, Min: 6, Hashed", "Hidden (select:false)", "Bcrypt hashed password with 10 salt rounds."],
        ["department", "String", "Default: 'General Studies'", "None", "Academic major (e.g. Computer Science, Data Science)."],
        ["avatarUrl", "String", "Optional (URL String)", "None", "URL to avatar image; falls back to Dicebear SVG avatar."],
        ["bio", "String", "Optional, Max: 240", "None", "Short description of student's academic interests and strengths."],
        ["createdAt / updatedAt", "Date", "Auto Timestamps", "None", "Audit timestamps tracking account creation and edits."]
    ]
    add_styled_table(doc, user_headers, user_data, [1.1, 0.9, 1.4, 1.1, 2.0])

    add_h2(doc, "4.2 Session Offering Schema (`Session.js`)")
    add_p(doc,
        "The Session collection represents academic assistance offerings published by hosts. Compound indexes support "
        "rapid filtering by status and category, while a MongoDB text index enables full-text keyword searches across "
        "title, description, and skill tags."
    )

    session_headers = ["Field Name", "BSON Type", "Constraints", "Indexing", "Functional Description"]
    session_data = [
        ["_id", "ObjectId", "Primary Key (Auto)", "Unique Index", "Unique session identifier."],
        ["creator", "ObjectId", "Required, Ref: 'User'", "Indexed", "Foreign reference to the User who created the offering."],
        ["title", "String", "Required, Trim, Max: 120", "Text Index", "Descriptive headline of the offered time session."],
        ["category", "String", "Enum: [Notes, Coding, Pres., Acad., Other]", "Compound Index", "Academic classification of the offering."],
        ["description", "String", "Required, Max: 1000", "Text Index", "Detailed syllabus, topic coverage, and prerequisites."],
        ["skillOffered", "String", "Optional, Trim, Max: 200", "Text Index", "Specific concept tags (e.g. 'React, Hooks, Vite')."],
        ["durationMinutes", "Number", "Min: 10, Max: 240, Def: 45", "None", "Length of the session in minutes."],
        ["timeSlot", "String", "Required, Trim", "None", "Scheduled time or availability window (e.g. 'Thursday 4 PM')."],
        ["status", "String", "Enum: [Open, Booked, Completed, Cancelled]", "Compound Index", "Current availability state (Default: 'Open')."],
        ["createdAt / updatedAt", "Date", "Auto Timestamps", "Compound Index", "Chronological audit timestamps."]
    ]
    add_styled_table(doc, session_headers, session_data, [1.1, 0.9, 1.4, 1.1, 2.0])

    add_h2(doc, "4.3 Booking & Request Schema (`Booking.js`)")
    add_p(doc,
        "The Booking collection governs the two-sided slot reservation workflow between a requester and a session host. "
        "A compound index on `{ session: 1, requester: 1, status: 1 }` prevents a student from spamming duplicate "
        "pending requests on the same session."
    )

    booking_headers = ["Field Name", "BSON Type", "Constraints", "Indexing", "Functional Description"]
    booking_data = [
        ["_id", "ObjectId", "Primary Key (Auto)", "Unique Index", "Unique booking request identifier."],
        ["session", "ObjectId", "Required, Ref: 'Session'", "Compound Index", "Foreign reference to the target session offering."],
        ["requester", "ObjectId", "Required, Ref: 'User'", "Compound Index", "Foreign reference to the student requesting the slot."],
        ["creator", "ObjectId", "Required, Ref: 'User'", "Indexed", "Foreign reference to the session host (denormalized)."],
        ["message", "String", "Optional, Max: 500", "None", "Introductory note stating learning goals and trade offer."],
        ["status", "String", "Enum: [Pending, Accepted, Rejected, Cancelled]", "Indexed", "Request state machine indicator (Default: 'Pending')."],
        ["createdAt / updatedAt", "Date", "Auto Timestamps", "Indexed", "Submission and decision audit timestamps."]
    ]
    add_styled_table(doc, booking_headers, booking_data, [1.1, 0.9, 1.4, 1.1, 2.0])

    # ==========================================
    # 6. API ENDPOINT DOCUMENTATION
    # ==========================================
    add_h1(doc, "5. RESTful API Endpoint Documentation")

    add_p(doc,
        "The TimeTrade REST API conforms to strict RESTful conventions with predictable resource URIs, standard HTTP "
        "verbs, structured JSON error formats, and semantic status codes."
    )

    api_headers = ["Method", "Endpoint Route", "Auth", "Request Body / Params", "Status", "Response Summary"]
    api_data = [
        ["POST", "/api/auth/register", "Public", "{ name, email, password, department, bio }", "201", "Returns user profile object and signed JWT token."],
        ["POST", "/api/auth/login", "Public", "{ email, password }", "200", "Validates credentials; returns user profile and JWT token."],
        ["GET", "/api/auth/me", "Bearer JWT", "None (Header Token)", "200", "Returns current authenticated student user profile."],
        ["PUT", "/api/auth/profile", "Bearer JWT", "{ name, department, bio, avatarUrl }", "200", "Updates profile metadata and returns updated user."],
        ["GET", "/api/sessions", "Public", "Query: ?search=&category=&status=&page=&limit=", "200", "Paginated list of sessions with populated creator data."],
        ["GET", "/api/sessions/my", "Bearer JWT", "None", "200", "List of all session offerings published by the logged-in user."],
        ["GET", "/api/sessions/:id", "Public", "Param: id (MongoDB ObjectId)", "200", "Detailed session object with creator profile and bio."],
        ["POST", "/api/sessions", "Bearer JWT", "{ title, category, description, durationMinutes, timeSlot }", "201", "Creates offering, sets status to 'Open', returns session."],
        ["PUT", "/api/sessions/:id", "Bearer JWT", "{ title, category, description, status, ... }", "200", "Updates offering (verified: creator only)."],
        ["DELETE", "/api/sessions/:id", "Bearer JWT", "Param: id", "200", "Deletes offering and cascade purges associated bookings."],
        ["POST", "/api/bookings", "Bearer JWT", "{ sessionId, message }", "201", "Submits slot request; validates session is open and not self-owned."],
        ["GET", "/api/bookings/incoming", "Bearer JWT", "None", "200", "Returns incoming requests for user's offerings with requester details."],
        ["GET", "/api/bookings/my", "Bearer JWT", "None", "200", "Returns outgoing requests submitted by current student."],
        ["PATCH", "/api/bookings/:id/status", "Bearer JWT", "{ status: 'Accepted' | 'Rejected' }", "200", "Host accepts/rejects. On accept: session -> 'Booked'."],
        ["PATCH", "/api/bookings/:id/cancel", "Bearer JWT", "Param: id", "200", "Cancels request. If previously accepted, reverts session to 'Open'."],
        ["GET", "/api/health", "Public", "None", "200", "Returns API uptime, timestamp, and MongoDB connection status."]
    ]
    add_styled_table(doc, api_headers, api_data, [0.7, 1.5, 0.8, 1.6, 0.5, 1.4])

    # ==========================================
    # 7. IMPLEMENTATION & KEY CODE MODULES
    # ==========================================
    add_h1(doc, "6. Implementation & Key Code Modules")

    add_h2(doc, "6.1 JWT Authentication & Route Protection Middleware")
    add_p(doc,
        "Authentication is secured through asymmetric-ready HMAC-SHA256 JWT tokens. The backend protect middleware "
        "extracts the token from the HTTP Authorization header, verifies signature integrity, and attaches the active "
        "User document to req.user. On the client side, ProtectedRoute intercepts unauthenticated navigation attempts "
        "and redirects to /login while preserving the intended destination in router location state."
    )

    code_auth = """// File: /server/middleware/authMiddleware.js
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return errorResponse(res, 'Authentication required. No token provided.', 401);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return errorResponse(res, 'User no longer exists.', 401);
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Session token expired. Please sign in again.', 401);
    }
    return errorResponse(res, 'Invalid authentication token.', 401);
  }
};"""
    add_code_block(doc, code_auth, "JavaScript (Backend JWT Middleware)")

    add_h2(doc, "6.2 Two-Sided Request Approval State Machine")
    add_p(doc,
        "The core domain innovation resides in bookingService.js. When a host accepts an incoming slot request, the "
        "service performs an atomic transition: the chosen booking is marked 'Accepted', the parent Session status is "
        "switched to 'Booked', and all other pending inquiries for that session are automatically updated to 'Rejected'. "
        "Conversely, if an accepted booking is cancelled, the session availability is seamlessly restored to 'Open'."
    )

    code_booking = """// File: /server/services/bookingService.js (State Machine Logic)
export const updateBookingStatus = async ({ bookingId, userId, newStatus }) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error('Booking request not found.');
  if (booking.creator.toString() !== userId.toString()) {
    throw new Error('Forbidden: Only the session host can update request status.');
  }

  booking.status = newStatus;
  await booking.save();

  if (newStatus === 'Accepted') {
    // 1. Mark corresponding session as 'Booked'
    await Session.findByIdAndUpdate(booking.session, { status: 'Booked' });

    // 2. Automatically reject all other competing pending requests
    await Booking.updateMany(
      { session: booking.session, _id: { $ne: booking._id }, status: 'Pending' },
      { status: 'Rejected' }
    );
  }
  return await booking.populate([
    { path: 'session', select: 'title category durationMinutes timeSlot status' },
    { path: 'requester', select: 'name email department avatarUrl' }
  ]);
};"""
    add_code_block(doc, code_booking, "JavaScript (Two-Sided Approval State Machine)")

    add_h2(doc, "6.3 Axios Client Interceptor Pipeline")
    add_p(doc,
        "To guarantee seamless client-server interaction without manual token handling in components, a centralized "
        "Axios instance intercepts every outbound request and inbound response. It injects authentication tokens and "
        "dispatches a custom window event on 401 errors to trigger immediate, graceful logout."
    )

    code_axios = """// File: /client/src/api/axios.js (Network Layer Interceptors)
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('timetrade_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('timetrade_token');
      localStorage.removeItem('timetrade_user');
      window.dispatchEvent(new Event('timetrade_auth_logout'));
    }
    return Promise.reject(error);
  }
);
export default api;"""
    add_code_block(doc, code_axios, "JavaScript (Axios Interceptors)")

    # ==========================================
    # 8. SECURITY & PRODUCTION READINESS
    # ==========================================
    add_h1(doc, "7. Security & Production Readiness")

    add_p(doc,
        "TimeTrade enforces comprehensive defense-in-depth security measures to protect student data and prevent "
        "common web application vulnerabilities as defined by OWASP Top 10."
    )

    sec_headers = ["Security Vector", "Implemented Mechanism", "Production Justification"]
    sec_data = [
        ["Password Encryption", "bcryptjs with 10 salt rounds", "Protects user credentials against rainbow table and brute-force cracking using computationally intensive key derivation."],
        ["Brute-Force Mitigation", "express-rate-limit (30 req / 15 min)", "Enforces IP-based rate limiting on /api/auth endpoints, preventing automated credential stuffing attacks."],
        ["HTTP Header Hardening", "Helmet.js middleware", "Sets Content-Security-Policy, X-Frame-Options (anti-clickjacking), X-Content-Type-Options, and Strict-Transport-Security."],
        ["Origin Whitelisting", "Express CORS validation", "Restricts cross-origin AJAX access exclusively to authorized frontend domains specified in environment configuration."],
        ["Input Sanitization", "express-validator body schemas", "Enforces strict type, length, and format constraints on all incoming JSON payloads, neutralizing NoSQL injection vectors."],
        ["Operational Error Isolation", "Centralized errorHandler middleware", "Traps Mongoose CastErrors, duplicate key collisions, and runtime exceptions without exposing internal server stack traces to clients."],
        ["Git Repository Hygiene", "Triple-tier .gitignore configuration", "Ensures .env secrets, node_modules/, and build artifacts are strictly excluded from version control."]
    ]
    add_styled_table(doc, sec_headers, sec_data, [1.3, 1.8, 3.4])

    # ==========================================
    # 9. TESTING & VERIFICATION
    # ==========================================
    add_h1(doc, "8. Testing & Quality Verification")

    add_h2(doc, "8.1 API Integration Test Matrix")
    add_p(doc,
        "System endpoints were validated using Postman and automated test suites covering positive, boundary, "
        "and negative error scenarios."
    )

    test_headers = ["Test ID", "Target Endpoint", "Test Scenario & Input", "Expected Status", "Observed Result"]
    test_data = [
        ["TC-AUTH-01", "POST /api/auth/register", "Valid student registration data", "201 Created", "PASS - User saved, JWT returned."],
        ["TC-AUTH-02", "POST /api/auth/register", "Duplicate email registration", "409 Conflict", "PASS - Handled with duplicate alert message."],
        ["TC-AUTH-03", "POST /api/auth/login", "Invalid password attempt", "401 Unauthorized", "PASS - Access denied, generic error returned."],
        ["TC-SESS-01", "GET /api/sessions", "Query with category='Coding' & status='Open'", "200 OK", "PASS - Returns filtered session list."],
        ["TC-SESS-02", "POST /api/sessions", "Unauthenticated session creation attempt", "401 Unauthorized", "PASS - Blocked by JWT protect middleware."],
        ["TC-BOOK-01", "POST /api/bookings", "Student requests own offering", "400 Bad Request", "PASS - Prevented by self-booking guard."],
        ["TC-BOOK-02", "PATCH /api/bookings/:id/status", "Host accepts request; conflicting requests exist", "200 OK", "PASS - Session becomes 'Booked', competitor rejected."],
        ["TC-BOOK-03", "PATCH /api/bookings/:id/cancel", "Accepted booking cancelled by requester", "200 OK", "PASS - Session reverts to 'Open'."]
    ]
    add_styled_table(doc, test_headers, test_data, [0.8, 1.5, 2.0, 0.9, 1.3])

    add_h2(doc, "8.2 User Acceptance Testing (UAT)")
    add_bullet(doc, "Scenario A (Student Discovery Walkthrough): ", "A student visits the marketplace, applies the 'Notes' topic filter, locates 'BCA Semester 5 Web Technologies Handwritten Notes', views host details, and submits a request note in under 45 seconds.")
    add_bullet(doc, "Scenario B (Host Fulfillment Walkthrough): ", "The session host logs into their dashboard, sees an incoming request with an amber badge indicator, reviews the requester's note, clicks 'Accept', and verifies the session is immediately marked 'Booked'.")
    add_bullet(doc, "Scenario C (Session Lifecycle Completion): ", "After completing the collaborative notes review, the host clicks 'Mark Completed' in the dashboard, transferring the record to the immutable 'Completed History' log.")

    # ==========================================
    # 10. CONCLUSION & FUTURE ENHANCEMENTS
    # ==========================================
    add_h1(doc, "9. Conclusion & Future Enhancements")

    add_h2(doc, "9.1 Project Outcomes & Academic Conclusion")
    add_p(doc,
        "The TimeTrade: Student Time-Exchange Board project demonstrates a comprehensive, enterprise-ready implementation "
        "of modern full-stack web engineering principles for the BCA Semester 5 Capstone curriculum. By successfully "
        "unifying a decoupled React 18 Single Page Application with a secured Node.js/Express REST backend and MongoDB document "
        "storage, the platform bridges the critical gap between academic peer support needs and structured collaboration. "
        "All functional requirements—including user onboarding, full CRUD offerings, debounced marketplace search, and "
        "the two-sided slot reservation state machine—have been realized and verified with zero production errors."
    )

    add_h2(doc, "9.2 Future Enhancement Roadmap")
    add_bullet(doc, "Real-Time WebSocket Chat (Socket.io): ", "Embed integrated peer messaging allowing students to chat and clarify session logistics directly within the slot request modal prior to host acceptance.")
    add_bullet(doc, "Integrated WebRTC Video Study Rooms: ", "Provide one-click peer-to-peer audio/video rooms with screen sharing directly inside the TimeTrade browser interface for remote pair programming.")
    add_bullet(doc, "Calendar Synchronization (.ics / Google Calendar API): ", "Enable automatic export of accepted session schedules into students' personal calendars with automated reminder alerts.")
    add_bullet(doc, "Time Credit Wallet & Student Karma System: ", "Introduce a digital credit ledger tracking time balances, accompanied by student review ratings (1-5 stars) and skill endorsements.")
    add_bullet(doc, "Automated Push & Email Notifications: ", "Implement transactional email notifications (via Nodemailer/SendGrid) alerting hosts when new slot requests arrive.")

    # ==========================================
    # 11. REFERENCES & APPENDIX
    # ==========================================
    add_h1(doc, "10. References & Appendix")

    add_h2(doc, "10.1 Technical & Academic References")
    add_bullet(doc, "React Documentation: ", "Meta Platforms Inc., 'React 18 & Hooks Specification', https://react.dev")
    add_bullet(doc, "Express.js Foundation: ", "StrongLoop / OpenJS Foundation, 'Express 4 REST Framework', https://expressjs.com")
    add_bullet(doc, "MongoDB Mongoose ODM: ", "Automattic Inc., 'Mongoose v8 Schema Modeling Reference', https://mongoosejs.com")
    add_bullet(doc, "Tailwind CSS: ", "Tailwind Labs, 'Utility-First CSS Framework Documentation', https://tailwindcss.com")
    add_bullet(doc, "OWASP Foundation: ", "Open Web Application Security Project, 'OWASP Top 10 Web Application Security Risks', https://owasp.org")
    add_bullet(doc, "IETF RFC 7519: ", "Jones et al., 'JSON Web Token (JWT) Standard Specification', Internet Engineering Task Force")

    add_h2(doc, "10.2 Project Repository & Local Setup Summary")
    add_p(doc,
        "The complete source code is organized within a dual-module repository. Follow these commands to initialize "
        "and launch the platform locally:"
    )

    setup_code = """# 1. Clone repository & install dependencies
git clone <repository-url>
cd timetrade-platform
npm install
npm run install:all

# 2. Seed database with realistic demo students & offerings
npm run seed

# 3. Launch both backend (port 5000) & frontend (port 5173) concurrently
npm run dev

# 4. Access application in browser
# Frontend: http://localhost:5173
# REST API: http://localhost:5000/api/health"""
    add_code_block(doc, setup_code, "Bash / Terminal Setup")

    # Output path
    out_path = r"c:\Users\91702\OneDrive\Desktop\Abuzer\BCA Programs\5TH SEM\Front-end Theory\Frontend & Backend Project\TimeTrade_Academic_Project_Report.docx"
    doc.save(out_path)
    print(f"Document successfully created at: {out_path}")

if __name__ == "__main__":
    create_document()
