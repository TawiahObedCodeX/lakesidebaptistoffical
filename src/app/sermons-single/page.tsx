import { BodyClass } from "@/components/BodyClass";
import { Icon } from "@/components/Icon";

export default function SermonsSinglePage() {
  return (
    <>
      <BodyClass className="sermon-single-page" />

      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <div className="page-header-box">
                <h1 className="text-anime-style-2" data-cursor="-opaque">
                  Start a New Way of Living
                </h1>

                <div className="sermon-hero-panel wow fadeInUp" data-wow-delay="0.2s">
                  <div className="sermon-hero-main">
                    <p className="sermon-hero-kicker">Faith Series • Week 4</p>
                    <p className="sermon-hero-subtitle">
                      Reset your week with a message that brings clarity, courage, and a fresh start in Christ.
                    </p>
                    <div className="sermon-hero-tags">
                      <span>Hope</span>
                      <span>Purpose</span>
                      <span>Renewal</span>
                    </div>
                  </div>

                  <div className="sermon-hero-actions">
                    <a href="#player" className="btn-default btn-highlighted">
                      Play Message
                    </a>
                    <a href="#" className="btn-default">
                      Download Notes
                    </a>
                    <a href="#" className="btn-default btn-border">
                      Share Sermon
                    </a>
                  </div>
                </div>

                <div className="sermon-hero-stats wow fadeInUp" data-wow-delay="0.35s">
                  <div className="sermon-stat-card">
                    <span>Duration</span>
                    <h3>32 min</h3>
                  </div>
                  <div className="sermon-stat-card">
                    <span>Date</span>
                    <h3>Aug 03, 2025</h3>
                  </div>
                  <div className="sermon-stat-card">
                    <span>Speaker</span>
                    <h3>Pastor John Due</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-sermons-single sermons-single-alt sermons-single-catchy">
        <div className="container">
          <div className="sermon-top-banner">
            <div className="banner-content">
              <span className="banner-chip">New Series</span>
              <h2>Start a New Way of Living</h2>
              <p>Renew your faith journey with scripture-led wisdom and practical steps for everyday life.</p>
            </div>
            <div className="banner-stats">
              <div>
                <h3>42 min</h3>
                <p>Message Length</p>
              </div>
              <div>
                <h3>1.2k+</h3>
                <p>Listeners</p>
              </div>
              <div>
                <h3>Aug 10</h3>
                <p>Next Gathering</p>
              </div>
            </div>
          </div>

          <div className="sermons-single-layout">
            <div className="sermons-main">
              <div className="sermon-hero-card">
                <div className="sermon-hero-media">
                  <img src="/images/sermons-img-1.jpg" alt="" />
                  <span className="sermon-badge">Featured Sermon</span>
                </div>
                <div className="sermon-hero-content">
                  <div className="sermon-meta">
                    <span>
                      <Icon name="tag" /> Prayer &amp; Growth
                    </span>
                    <span>
                      <Icon name="location" /> Main Sanctuary
                    </span>
                    <span>
                      <Icon name="calendar-days" /> Aug 10 • 9:00 AM
                    </span>
                  </div>
                  <h2 className="text-anime-style-2" data-cursor="-opaque">
                    Start a New Way of Living
                  </h2>
                  <p>
                    Embrace a Christ-centered mindset and step into a life shaped by purpose, renewal, and joy. This
                    message offers clear steps to release past burdens and walk in faith.
                  </p>
                  <div className="sermon-actions">
                    <a href="/sermons" className="btn-default">
                      All Sermons
                    </a>
                    <a href="/contact" className="btn-default btn-highlighted">
                      Plan a Visit
                    </a>
                  </div>
                </div>
              </div>

              <div className="sermon-audio-panel">
                <div className="audio-panel-header">
                  <h3>Listen to the Message</h3>
                  <p>Stream the full sermon or share it with a friend.</p>
                </div>
                <audio id="player" controls>
                  <source
                    src="https://demo.awaikenthemes.com/assets/videos/avenix-audio.mp3"
                    type="audio/mp3"
                  />
                </audio>
              </div>

              <div className="sermon-content-grid">
                <div className="sermon-content-block">
                  <h3>Sermon Notes</h3>
                  <div className="sermon-takeaways wow fadeInUp" data-wow-delay="0.15s">
                    <h4>Key Takeaways</h4>
                    <ul>
                      <li>Release yesterday&apos;s burdens and move forward in faith.</li>
                      <li>Align daily choices with God&apos;s purpose for your life.</li>
                      <li>Build habits that strengthen spiritual growth.</li>
                    </ul>
                  </div>
                  <p className="wow fadeInUp" data-wow-delay="0.2s">
                    Join us for an inspiring sermon on &quot;Start a New Way of Living.&quot; Discover how embracing
                    faith can transform your life, guiding you toward a path of purpose, fulfillment, and joy.
                  </p>
                  <p className="wow fadeInUp" data-wow-delay="0.4s">
                    Whether you&apos;re seeking a fresh start or deeper spiritual growth, this message provides the
                    encouragement and tools you need to embark on a transformative journey.
                  </p>
                </div>

                <div className="sermon-content-block sermon-details-card">
                  <h3>Sermon Details</h3>
                  <ul className="sermon-detail-list">
                    <li>
                      <span>Speaker</span>
                      <strong>Pastor John Due</strong>
                    </li>
                    <li>
                      <span>Series</span>
                      <strong>New Beginnings</strong>
                    </li>
                    <li>
                      <span>Duration</span>
                      <strong>42 Minutes</strong>
                    </li>
                    <li>
                      <span>Next Gathering</span>
                      <strong>Aug 10 • 9:00 AM</strong>
                    </li>
                  </ul>
                  <div className="sermon-social">
                    <h4>Share This Sermon</h4>
                    <div className="sermon-social-links">
                      <a href="#">
                        <Icon name="facebook" />
                      </a>
                      <a href="#">
                        <Icon name="linkedin" />
                      </a>
                      <a href="#">
                        <Icon name="instagram" />
                      </a>
                      <a href="#">
                        <Icon name="twitter" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="sermons-aside">
              <div className="aside-card speaker-card">
                <div className="speaker-icon">
                  <Icon name="microphone" />
                </div>
                <div className="speaker-content">
                  <span>Speaker</span>
                  <h4>Pastor John Due</h4>
                  <p>Teaching with practical insight and scripture-led encouragement.</p>
                </div>
              </div>

              <div className="aside-card schedule-card">
                <h4>Upcoming Schedule</h4>
                <ul>
                  <li>
                    <span>Sun • 9:00 AM</span>
                    <strong>Worship Service</strong>
                  </li>
                  <li>
                    <span>Wed • 7:00 PM</span>
                    <strong>Prayer Night</strong>
                  </li>
                  <li>
                    <span>Fri • 6:30 PM</span>
                    <strong>Youth Gathering</strong>
                  </li>
                </ul>
              </div>

              <div className="aside-card related-card">
                <h4>Related Sermons</h4>
                <div className="related-mini">
                  <img src="/images/sermons-img-2.jpg" alt="" />
                  <div>
                    <h5>Overcoming Life&apos;s Challenges</h5>
                    <p>Aug 03 • 7:00 AM</p>
                  </div>
                </div>
                <div className="related-mini">
                  <img src="/images/sermons-img-3.jpg" alt="" />
                  <div>
                    <h5>Hope in Times of Trouble</h5>
                    <p>Aug 08 • 7:00 AM</p>
                  </div>
                </div>
                <div className="related-mini">
                  <img src="/images/sermons-img-4.jpg" alt="" />
                  <div>
                    <h5>Building Stronger Faith</h5>
                    <p>Aug 11 • 7:00 AM</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

